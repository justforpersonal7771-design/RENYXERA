# Competitor gap checklist (10 Oct 2026)

Compared with **The GATE Grind** (thegategrind.online) and **Project Forge** (projectforgeapp.in), both opened in a
real browser on desktop and phone, against our own app on the same screens. Tick items as they ship.
Evidence column says what was actually seen; "verify" means not yet confirmed in our code.

## What they have that we don't

### Phone navigation and accessibility
- [ ] **P0 · Bottom tab bar on phones** (Home · Practice · Review · AI Mentor · More). Our phone UI is a top header with small icons and a hamburger; primary actions sit at the top, out of thumb reach. *Seen on our phone screenshot. Neither competitor has a bottom bar either (both use a hamburger), so this would put us ahead.*
- [ ] **P1 · Shorter phone home**: the hero takes more than one screen before any stat. Show the next action and today's focus first.
- [ ] **P1 · New-user dashboard shows rows of zeros** (0 days, 0 questions, 0%). Replace with a short "get started" checklist until there is data. *Seen on our phone home.*

### First visit and landing
- [ ] **P0 · Signed-out home is the dashboard**, with no "what is this" section. The Grind's landing says in one screen: 4,485 questions · 69 papers · branches · 2015–2026 · "Free. No login needed." Add a proof line and a clear free/no-login message. *Our own numbers: 2,470 PYQs, 5 papers.*
- [ ] **P1 · "Try a real question" on the landing page** (The Grind has it). Reuse a public question with the answer reveal.
- [ ] **P2 · 90-second demo video** on the landing page (The Grind has "Watch the demo").
- [ ] **P1 · Guest cap**: guests get at most 15-question tests; The Grind lets people practise everything without signing up. Decide whether to loosen it (a trade-off with sign-ups).

### Content coverage
- [ ] **P1 · Older papers**: The Grind lists CS/EE/EC from 2015; we have CS from 2017 and EC/EE/ME from 2021 (DA from 2024, which is all that exists). *Task: 2017–2020 for EC/EE/ME, 2015–2016 for CS.*
- [ ] **P1 · CE** (they list 7 papers). Already planned.
- [ ] **P2 · Other papers** they list: Chemical (CH), English (XH2), Psychology (XH5). Only if demand shows up.
- [ ] **P1 · General Aptitude learning**: concept pages, worked examples, topics ranked by how often they appear, and a daily short test ("6 questions, 9 marks, 9 minutes"). We only have GA questions inside papers. *GA is 15 marks in every paper, a shared audience across all branches.*
- [ ] **P1 · Subject/topic browser with counts and a search box** (The Grind's Browse page: "Engineering Mathematics · 150 questions"). *Verify what our header search covers.*

### Learning features
- [ ] **P1 · Topic checkpoints**: a short ladder of questions from warm-up to stretch after you finish a topic, with last-minute notes on what you missed. We have topic tests but no ladder or notes.
- [ ] **P1 · Personal progress on the syllabus pages** ("0/61 topics solid", with a Show/Hide progress toggle). Our syllabus pages show public weightage only; add the signed-in student's own progress per topic.
- [ ] **P1 · Daily revision habit mode** (Project Forge: ~15 questions a day, spaced repetition, streak flame). We have Revision and streaks, but no single "do today's 15" flow.
- [ ] **P2 · Weekly leagues and 1v1 battles** (Project Forge). We have a leaderboard; the "Beat my score" friend challenge (task L-4) is the cheap version.
- [ ] **P2 · Time-split guidance on mocks** (The Grind: General Aptitude 0–20 min, subject paper 20–150, recheck 150–180, plus tips). Add a small tips panel on the mock/setup screen.

### Growth surfaces
- [ ] **P2 · "Grow together" share prompt** (The Grind puts one on nearly every page). We have invite/share on results and question pages only.

## What we already do better (do not copy, do promote)
AI Mentor and Tutor · mistakes list with revision · analytics by subject/topic · study planner and calendar · All-India mocks and leaderboard ·
cloud sync across devices · syllabus weightage for CS/EC/EE/ME/DA · score and rank predictor, cut-off tools (CS) · exam interface with timer, palette, sections and (since today) calculator ·
a daily Telegram question with yesterday's answer.

## Done from this review (10 Oct)
- [x] Virtual calculator in the exam screen (compact; hold anywhere outside to hide it, tap outside to close)
- [x] Telegram join card on public pages and dashboard (no raw links)
- [x] Syllabus pages use the full page width
