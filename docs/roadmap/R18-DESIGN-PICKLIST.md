# R18 design pick-list — tick what you want (27 Oct 2026)

*From a second review of Swaseekh (desktop 1440 + phone 390, scrolled step by step so every animation fired) and the Hatchable hub. Nothing is copied: each item is our own, better version. Tick `[x]` on the ones you want; ⭐ = my recommendation. Grouped so related items ship together.*

**What makes Swaseekh feel premium (observed):** warm off-white canvas (not pure white); pastel colour per feature (mint, rose, peach, periwinkle, lilac, butter, sky); big rounded cards (32 px desktop, 24 px phone) with soft deep shadows; **sticky stacking cards** — each card pins near the top and the earlier ones shrink to 72 % and peek out above like a deck; a mini live preview on the right of each card (dot grid of years, progress bars, a timer ring, a fake textbook page with a pinned PYQ); black pill buttons; small black uppercase labels ("PYQ BANK"); playful illustrated mascots band; tilted floating stat cards in the hero; live countdown in the header; a step-by-step animated solution demo with a progress bar; a segmented tab bar under a device mock-up; a giant watermark wordmark in the footer; "cursor name tags" on the newsletter card.

---

## Group A — Foundation (look and feel everywhere)
- [x] ⭐ **A1 Warm canvas + pastel accent per module** — warm off-white background (light) / deep ink (dark); each module gets its own soft pastel (Practice mint, Mocks periwinkle, Review rose, AI Mentor lilac, Planner peach, Analytics sky, Forge amber), used for its cards, chips and charts. Keeps our violet brand for primary actions.
- [x] ⭐ **A2 New card shell** — 24/32 px radius, layered soft shadow, 1 px inner highlight, hover lift 2 px + our cursor spotlight; one consistent shell for every card.
- [x] ⭐ **A3 Section labels** — small uppercase pill labels ("TODAY", "WEAK SPOTS") above card titles; titles in Bricolage bold, numbers in tabular font.
- [x] A4 **Black/ink pill buttons** for secondary actions (primary stays the brand gradient).
- [x] A5 **Brand watermark** — giant faint RENYXERA wordmark behind the footer and empty states.
- [x] A6 **Mascot/illustration set** — a small set of friendly study characters for empty states, onboarding and the landing band (made by us, consistent with the logo colours).

## Group B — Motion and effects
- [x] ⭐ **B1 Sticky stacking cards** (Swaseekh's signature, done better) — on the **landing page and Plans page**: each feature card pins, the previous one shrinks and fades slightly, peeking edges show progress; on phones the stack is tighter; reduced-motion users get a normal list. *Not used inside the app screens, where it would slow work down.*
- [x] ⭐ **B2 Live mini-previews inside cards** — each feature/dashboard card shows a tiny live widget with real data (year dot-grid, timer ring, progress bars, streak flame), animating once into view.
- [x] B3 **Tilted floating stat cards** in the landing hero (real numbers: questions, branches, mocks), gently parallaxing.
- [x] B4 **Count-up numbers and bar fills** when cards enter the screen (once).
- [x] ⭐ **B5 Animated step-by-step solution player** — question on the left, "now teaching step 2 of 4" with progress segments, diagram drawn step by step; used on the landing page demo and later for every solution (R20).
- [x] B6 **Segmented tab bar under a device mock-up** on the landing page that switches the screenshot (Practice / Mocks / AI Mentor / Analytics / Planner).
- [x] B7 **Live countdown chip in the header** (days : hours : minutes to GATE 2027).

## Group C — Dashboard refresh (R18A) with these components
- [x] ⭐ **C1 Next-action hero (compact)** — one recommended action + two secondary, countdown chip; half the current height.
- [x] ⭐ **C2 Today strip** — plan blocks, daily target ("N questions today to finish on time"), streak with freeze tokens.
- [x] ⭐ **C3 Bento grid** of pastel cards: progress trio (syllabus, accuracy trend, readiness), where marks leak, revision due, next mock, subject heat tiles, battles.
- [x] C4 **Year dot-grid** card (like their "28 of 39 years") for your weakest topic: which years asked it and whether you solved it.
- [x] C5 **Book-style subject card** — a "cover" tile per subject with your mastery and top topics bars (our study material later fills it).

## Group D — Analytics and syllabus
- [x] ⭐ **D1 Subject share list with expanding rows** — bar per subject; tap to reveal most-asked topics with counts as chips (like their marks-share list, plus your accuracy beside it).
- [x] ⭐ **D2 Syllabus coloured by frequency** + institute filter (GATE 2027 = IIT Madras).
- [x] D3 **Progress example bars with "revise next" hint** in red for the weakest subject.

## Group E — AI Mentor
- [x] ⭐ **E1 Conversation-first layout** with pastel coach chips and data-driven suggested prompts; message actions (save, flashcard, practise similar).
- [x] E2 **"Key idea" callout boxes** in AI answers (blue box with a book icon), like their lesson callouts.

## Group F — Marketing pages
- [x] ⭐ **F1 Landing page rebuild** with B1 stacking cards (PYQ bank, Forge, Mocks, AI Mentor, Planner + Telegram, Analytics, Study materials).
- [x] F2 **Honest comparison table** (RENYXERA vs GATE Overflow / PDFs / coaching / test series) with hover details.
- [x] F3 **FAQ accordion** (sourced answers) + **newsletter/Telegram join card** with cursor-tag decoration.
- [x] F4 **"GATE 2027 on one page"** guide card (pattern, marks split, negative marking, dates).

## Group G — Features they have that we should out-build (from the first review)
- [x] ⭐ G1 Institute filter on PYQs/analytics (C1 in the competitor doc)
- [x] ⭐ G2 Step-by-step solution format for every PYQ (R20)
- [x] G3 PYQ pinned to our own lesson section (R12; never copyrighted books)
- [x] G4 Daily target counter on the dashboard
- [x] G5 Score blueprint (70+), progress report export, guided tour, focus mode (Hatchable ideas)

## My recommended first batch
A1, A2, A3 → C1, C2, C3 (dashboard) → B2, B4 → D1, D2 → E1 → then F1 with B1 stacking cards.
For each screen I show you a contact sheet (desktop + phone, light + dark) before building.
