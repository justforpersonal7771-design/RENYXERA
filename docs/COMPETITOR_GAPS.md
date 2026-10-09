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

| # | Pri | Gap | Who has it | Why it matters | Effort |
|---|---|---|---|---|---|
| 1 | P0 | [ ] **Bottom tab bar on phones** (Home · Practice · Review · AI · More). Ours is a top header of small icons plus a hamburger. | Forge | Thumb reach; the app-like feel students expect | S–M |
| 2 | P0 | [ ] **Diagnostic onboarding**: target year, weekly goal, target AIR, then a 20-question diagnostic that fills the dashboard (weak topics, plan) from minute five | Forge | Biggest lever for activation and day-1 return | M–L |
| 3 | P0 | [ ] **Landing for signed-out visitors** with proof line (2,470 PYQs · 5 papers · 2017–2026), "free, no login", try-a-real-question | Grind | Our signed-out home is a dashboard of zeros | S |
| 4 | P0 | [ ] **"Today" card**: today's N questions (spaced repetition from mistakes) plus 3 small daily missions | Forge | A daily reason to open the app; we already have Mistakes/Revision and streaks | M |
| 5 | P0 | [ ] **Personal progress on syllabus pages** per topic (Not started / Solid / Cleared) with a show/hide toggle | Grind | Turns our weightage pages into the study map | M |
| 6 | P1 | [ ] **Topic Checkpoint** (short ladder quiz + notes on what you missed) | Grind | Cheap to build from the tagged bank; closes the learn-then-test loop | M |
| 7 | P1 | [ ] **One-time "GATE 2027 pass"** (valid to March 2027) next to monthly plans, plus a 7–15 day trial | Forge | Their lifetime offer undercuts our monthly price for exam-season buyers | S (config) |
| 8 | P1 | [ ] **Weekly benchmark vs peers in your branch** and a **shareable weekly card** | PadhaiShuru | Motivation and free sharing (links to our on-hold Share result) | M |
| 9 | P1 | [ ] **Study timer with daily goal** (verified study minutes, week/month totals) | PadhaiShuru | Habit tracking; we show study hours but have no live timer (verify) | M |
| 10 | P1 | [ ] **"Beat my score" friend challenge**, then ELO 1v1 | Forge | Viral loop plus retention | M–L |
| 11 | P1 | [ ] **Weekly league with promotion** (top 10 move up) | Forge | Turns the leaderboard into a weekly goal | M |
| 12 | P1 | [ ] **Fresh randomised full mock each attempt** with difficulty control | Forge | Unlimited practice; verify what our custom/AI test already covers | S–M |
| 13 | P1 | [ ] **General Aptitude lessons + daily 6-question test** | Grind | GA is 15 marks for every branch | L |
| 14 | P1 | [ ] **"GATE 2027 changes" page** | PadhaiShuru | Cheap, search-friendly, builds trust | S |
| 15 | P2 | [ ] **Install as app + push reminders** (PWA) | Forge | Better than waiting for the Telegram bot | M |
| 16 | P2 | [ ] **Flashcard decks** (formulas, definitions) | Forge | Fast revision; needs content | L |
| 17 | P2 | [ ] **Predictor and cut-offs for EC/EE/ME/DA** (we have CS only) | PadhaiShuru | Search traffic; needs verified official data (task S-5) | M |
| 18 | P2 | [ ] **Subject/topic browser with counts and search** | Grind | Discovery on public pages (verify our header search) | M |
| 19 | P2 | [ ] **Mock time-split tips**; 90-second demo video | Grind | Small trust builders | S |
| 20 | P3 | [ ] **Older papers**: CS 2015–16, EC/EE/ME 2017–20; CE | Grind | Content depth; large but known work | L |
| 21 | P3 | [ ] **Personal PDF notes storage** | PadhaiShuru | Nice to have | M |
| 22 | P3 | [ ] **Private study rooms** (chat, shared files, timers) | PadhaiShuru | High effort plus moderation; defer | L |

## Where we are ahead (promote, don't copy)
Real exam interface with official-style timer, sections, palette and now a calculator · official answer keys for 2017–2026 · AI Mentor and Tutor ·
analytics and Mistakes/Revision loops · study planner and calendar · All-India mocks · cloud sync · syllabus weightage for five papers · EE and EC
coverage (Project Forge has neither yet) · a daily Telegram question with yesterday's answer.

## Done from earlier reviews (10 Oct)
- [x] Virtual calculator in the exam screen (compact; hold anywhere outside to hide it, tap outside to close)
- [x] Telegram join cards on public pages and dashboard (no raw links)
- [x] Syllabus pages use the full page width; same content width and top spacing on every page
