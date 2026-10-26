# Competitor analysis — Swaseekh and GATE CS Preparation Hub (26 Oct 2026)

*Method: both sites opened on desktop (1440) and phone (390). Swaseekh: public home page, `/about`, and the owner's screenshots; every inner page (`/gate/questions`, `/textbook/*`, `/mock-tests`, `/pricing`, `/dashboard`, `/aptitude`) redirects to "Continue with Google", which Claude cannot use (no access to a Google account, and credentials must never be entered by the agent). To review the signed-in screens: the owner signs in and shares screenshots, or opens a signed-in browser session on this PC for a screen-by-screen walkthrough. Hatchable site: fully open without login. Older competitors: `../../archive/docs/COMPETITOR_GAPS.md`.*

## 1. Swaseekh — https://swaseekh.in

**Positioning:** "Don't study more. Study what matters." GATE CS only. Free plan + **Pro ₹499/year**. Claims "500+ students", Clutch/Trustpilot 4.5 badges.

**What they have (from public pages)**
| Area | Feature |
|---|---|
| PYQ bank | 4,299 PYQs 1987–2025 (3,255 CS + 1,044 GA), tagged subject → topic → concept, difficulty, year, marks, type |
| Solutions | Step-by-step for 100 %: "given / to find", each step names the rule (87 %), ~2.8 steps each |
| Textbooks inside the app | 18 books (Rosen, Cormen, Hopcroft–Motwani–Ullman, Silberschatz, Forouzan…), 12,389 pages; each PYQ pinned to the textbook page that teaches it (98.7 %); draw/notes on pages |
| Visual lessons | Discrete Maths and Digital Logic: graphs, truth tables, K-maps, circuits, timing diagrams drawn step by step ("Watch a real PYQ get solved" animated demo on the home page) |
| Analytics | Marks share per subject 2021–25, most-asked topics per subject with counts, **filter by year and by organising institute** (their latest campaign: "GATE 2027 is by IIT Madras — see IIT Madras-set PYQs") |
| Syllabus | Coloured by how often each topic is asked |
| Practice | One PYQ at a time, answer check, bookmarks, notes, progress |
| Mocks | Year-wise full papers, 3-hour timer, palette, mark-for-review, GATE marking |
| Aptitude | Four GA books (verbal, quantitative, analytical, spatial) + 1,044 GA PYQs |
| Guide | "GATE 2027 on one page": pattern, marks split, question types, negative marking, dates |
| Daily target | "104 days to GATE 2027 → 42 PYQs a day to finish every PYQ" |
| Marketing | Comparison table vs GATE Overflow / PYQ PDF / book / coaching; hover details; honest note about GATE Overflow |

**Weak spots / risks**
- Everything behind Google login (no guest value beyond the landing page).
- Hosting full copyrighted textbooks (Rosen, Cormen…) is a serious legal risk; **we must not copy this approach** — our study materials stay original (see `../study-materials/`).
- CS only; no AI mentor, no planner automation, no Telegram, no All-India live mocks/ranks, no Forge-style original questions visible.
- 1987–2016 papers are pre-current-syllabus; useful for practice but they inflate counts.

## 2. GATE CS Preparation Hub (Hatchable) — https://gate-cs-preparation.hatchable.site

**Positioning:** "Your complete GATE CS preparation hub. Plan · Practice · Track · Improve." Free. Built with the Hatchable no-code builder; single-page app with hash routes.

**Features**
| Area | Feature |
|---|---|
| Overview | Hero "Make every session count", exam countdown (days/hours/minutes/seconds to 6 Feb 2027, official schedule note), progress cards (study hours, syllabus covered x/87 topics, quiz accuracy, subjects in focus), **Export progress report** |
| Analytics | Study hours last 7 days, subject time split, coverage by subject, quiz accuracy trend |
| Core syllabus | Topic checklist per subject (87 topics) with % covered |
| Topic analysis | Topic weightage view |
| 70+ Blueprint | Score blueprint: which subjects to target for a 70+ score |
| Schedule & streaks | Routine planner + streak |
| Study timer | Focus timer with session logging |
| Daily practice | Quiz |
| Rewards | Points/badges |
| Resources | Curated official links, GeeksforGeeks, GATE Overflow, NPTEL, YouTube playlists per subject |
| Community chat | Chat room |
| Quiet focus mode | Distraction-free mode |
| Extras | Notices, dark mode, "Share with friends", **11-step guided tour**, floating "Ask GATE CS Coach" AI |

**Weak spots:** no real PYQ bank or GATE-style exam engine visible, data entered by the student (self-reported hours/topics), generic AI coach, no payments/accounts depth, sidebar-heavy layout on phones.

## 3. What RENYXERA already does better
Six branches (they are CS only) · server-graded exam engine with integrity · All-India mocks and leaderboards · AI Mentor/Tutor on real questions · planner + Telegram automation · official-answer verification · guest mode · season pass and payments · PWA/offline · SEO pages per question.

## 4. Features to adopt or out-build (proposed backlog, ranked)

| # | Idea (inspired by) | Our better version | Release |
|---|---|---|---|
| C1 | Filter PYQs and analytics by **organising institute** (Swaseekh campaign) | Add `organiser` (IIT/IISc) to every paper in all six branches; analytics and practice filters "papers set by IIT Madras"; a public SEO page "GATE 2027 by IIT Madras: what their papers emphasise" with official sources | R14 / R18 |
| C2 | Step-by-step solution format for every PYQ (Swaseekh) | **Solutions release (R20)**: given → to find → steps naming the rule → answer → common trap → 1-line shortcut; verified against the official key; stored with the question; AI pre-gen as a draft, reviewed | R20 |
| C3 | PYQ pinned to "the page that teaches it" (Swaseekh) | Pin each PYQ to **our own study-material lesson section** (R12), never to copyrighted books | R12 |
| C4 | Animated visual solutions (graphs, K-maps, truth tables) | Diagram-as-data renderer from R12 reused in solutions; step-through animation | R12/R20 |
| C5 | "X days left → N PYQs a day" daily target | Dashboard target that also counts Forge items and revision due, adapts to the student's pace | R18 |
| C6 | Comparison table vs alternatives (Swaseekh) | Plans/landing comparison: RENYXERA vs GATE Overflow / PDFs / coaching / test series — honest, sourced | R13 |
| C7 | "GATE 2027 on one page" guide | Extend `/gate-updates` with pattern, marks split, question types and negative marking visual | R14 |
| C8 | Syllabus coloured by frequency | Already have shares; add colour heat + institute filter (C1) | R18 |
| C9 | 70+ score blueprint (Hatchable) | Goals engine already computes marks needed; add a visual "blueprint" card per target score with subject targets | R18 |
| C10 | Export progress report (Hatchable) | Shareable/printable PDF-like report (in-app print view) | R18 |
| C11 | Guided product tour (Hatchable) | First-visit tour (5 steps) with skip; re-open from Help | R18 |
| C12 | Curated resources page (Hatchable) | Official + free resources per subject (NPTEL, playlists) with our topic links | R14 |
| C13 | Quiet focus mode (Hatchable) | Focus mode: hides navigation, ambient timer, do-not-disturb for Telegram nudges | R18 |
| C14 | Topic checklist with self-marking (Hatchable) | Already have progress badges; add manual "done" with evidence from practice | R18 |
| C15 | Trust badges/reviews (Swaseekh) | Real testimonials with consent; never fake ratings | R13 |
| C16 | Older papers 1987–2016 (Swaseekh) | Optional CS archive, clearly labelled "pre-2017 syllabus" | 💡 |
