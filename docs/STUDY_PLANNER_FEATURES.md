# Study Planner: research and feature checklist (10 Oct 2026)

Goal: one **Study Planner** that a GATE aspirant opens daily to see what to do, do it, and see progress, for every branch.
Free users get the plan; Plus and Pro get it placed, tracked and adjusted for them (that is the reason to subscribe).

## 1. What the research says

**What competing planners do** (Indian exam apps and general planners; vendor pages, so treat claims as marketing):
- Jeeplanner (JEE): chapter-level syllabus coverage, smart chapter weighting, drag-and-drop planner, analytics, works offline — https://www.jeeplanner.in/
- Studiva: builds a timetable from subjects and exam dates and **adjusts it to your pace**; Pomodoro with ambient sound — https://www.studiva.in/
- QuickStudy: revisions at **1, 3, 7 and 14 days**, Pomodoro, group sessions — https://quickstudyy.web.app/
- Track Prep: logs sessions and shows **time per subject / topic**, with daily, weekly and monthly reports — https://play.google.com/store/apps/details?id=com.flys.trackprep&hl=en
- ExamGOAL and Syllabus Tracker: syllabus tracking for GATE across subjects, chapters and topics; mock reminders — https://play.google.com/store/apps/details?id=com.examgoal.android.app&hl=en_IN , https://play.google.com/store/apps/details?id=com.abc.reak.syllabustracker&hl=en_IN
- Poro: exam countdown and per-subject progress bars — https://poroapp.com/compare/
- Gap in the market: very few adapt the plan after you fall behind, almost none schedule mocks natively, and GATE-specific tools are thin. **That is our opening.**

**What the learning research supports** (weighed honestly):
- Spaced retrieval and interleaving help, but **frequent quizzing without spacing did worse** than spaced practice in a multi-college study — https://par.nsf.gov/servlets/purl/10544324 ; nudging students toward spacing and interleaving changed behaviour a lot, though only about half reached optimal levels. So the planner should *schedule* spaced reviews, not just list topics.
- Spacing feels harder in the moment ("desirable difficulty"), so students under-use it. Defaults must do it for them.
- Planning-fallacy evidence is mixed for exam preparation, so we will **not** add a blanket "+50%" to estimates; instead the planner re-plans from actual progress.
- I found no direct evidence on time-blocking or weekly reviews improving exam scores. We include a weekly review because it is cheap and fits adaptive re-planning, not because it is proven.

## 2. How it fits the app we already have
- **Study Planner page** = the existing `/calendar` (month / week / day, events, reminders, completion). Navbar calendar panel → "Expand" → **"Open Study Planner"**.
- **Plan generator** = the free tool `/tools/gate-study-plan` (all branches, weightage-based, phases, countdown). The old fixed "150-day plan" article is removed; the generator covers any runway.
- **Bridge** (built): "Add to my Study Planner" asks first (start date, study days, hours, start time, which phases, replace old plan), shows a summary, then creates the events. Plus / Pro only.
- Exam date is **set automatically** from the target year; the date picker overrides it.

## 3. Feature checklist, in priority order

Legend: **F** free · **+** Plus · **P** Pro. Status: [x] built · [ ] to do.

### Now: core (the loop that makes it useful)
- [x] **F** Exam date auto-set from target year, editable with a date picker; live countdown
- [x] **F** Branch-aware plan: hours per section from real weightage, weak/strong marking, three phases, week-by-week view
- [x] **+** Confirm-and-customise step, then one-click scheduling into the calendar (start date, study days, daily hours, start time, revision, mocks, mistakes review, replace old plan)
- [x] **+** Generated blocks are normal calendar events: tick done, move, edit, delete
- [x] **F** Navbar calendar panel links to the full Study Planner
- [x] **F** Reminder before a paid plan ends (7 days out, daily at the end, 30 days after)
- [ ] **+** Today view on the dashboard from the planner: "Today's blocks" with start / done (replaces the generic Today card when a plan exists)
- [ ] **+** Missed-block handling: unfinished blocks roll forward automatically; "I fell behind" button re-plans the remaining days (the adaptive step competitors lack)
- [ ] **+** Per-section priority (High / Normal / Low) and hours override, not only weak / strong
- [ ] **+** Different hours per weekday (for example 2 h on weekdays, 6 h on Sunday) and "rest days"
- [ ] **+** Weekly review card each Sunday: planned vs done hours, blocks missed, what moves next week

### Next: track and adapt
- [ ] **+** Syllabus coverage by **topic** (not just section): mark covered, link to the topic checkpoint and syllabus page
- [ ] **+** Weak topics fed automatically from analytics and mistakes (suggest "weak" instead of the user marking it)
- [ ] **+** Spaced revision scheduler: after a topic is covered, auto-add reviews at 1, 3, 7 and 14 days (and tie to the mistakes bank)
- [ ] **+** Study timer sessions linked to a block; time per subject, weekly totals, streak
- [ ] **+** Mock calendar: schedule full mocks (and the All-India mock) and book the analysis day after each
- [ ] **+** Progress score: coverage %, hours done vs planned, accuracy trend, projected readiness at exam date
- [ ] **P** "What if" planning: change hours or exam date and compare two plans side by side
- [ ] **P** Plan health: an on-track / at-risk indicator with the one change that fixes it

### Later: polish and reach
- [ ] **+** Reminders: push (PWA) and Telegram for today's blocks
- [ ] **+** Google / Apple calendar export (ICS file), then two-way sync
- [ ] **+** Pomodoro and focus mode inside a block
- [ ] **P** Plan templates: 100 / 60 / 30-day crash, working-professional, dropper; share a plan with a friend
- [ ] **P** AI Mentor re-plan: "my exam is in 6 weeks, I'm weak in X" → proposed changes you approve
- [ ] **P** Exports: PDF plan and weekly report
- [ ] **F** Public share card of a week's progress (links to the on-hold Share result)

## 4. Pricing fit
- Free: generator, countdown, week-by-week, manual use of the calendar.
- Plus: one-click scheduling, today view, roll-forward, priorities, weekday hours, weekly review, coverage, spaced revision.
- Pro: what-if, plan health, templates, exports, AI re-plan.
- The planner is a strong renewal driver: it is daily, personal and gets more valuable the longer you use it. Surface it in the Today card, the Plans page and the expiry reminder.

## 5. Open questions for the owner
- Should unfinished blocks roll forward silently, or ask once a day?
- Plus gets scheduling; is "what-if" and "plan health" enough to justify Pro, or should AI re-plan move down to Plus?
