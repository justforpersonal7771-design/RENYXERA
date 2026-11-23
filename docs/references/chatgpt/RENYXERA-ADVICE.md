# RENYXERA — Product Audit, UX Upgrade Plan & Zero-Budget Growth Advice

**Prepared:** 14 November 2026  
**Audience:** Product owner and Claude Code implementation sessions  
**Product:** RENYXERA — “A new ERA of intelligent learning”  
**Live application:** https://gate.renyxera.workers.dev  
**Status:** Advisory specification based on the supplied product context. Proposals are not claims that features have shipped.

---

## How to use this document

Treat the supplied RENYXERA context dated 14 November 2026 as the source of truth. This document separates **LIVE** (explicitly built), **PENDING** (unfinished), **ON HOLD** (paused by the owner), **PROPOSAL** (recommendation, not shipped), and **NEEDS OWNER CONFIRMATION** (decision not safely inferable).

Do not remove, rename, or rebuild existing functionality simply because a new UI is proposed. First inspect the repository, routes, database schema, feature flags, RLS policies and live behaviour. Reuse working capabilities. The owner is not a developer and applies database migrations and account setup manually, so every engineering task must state exactly what Claude Code changes and what the owner must do.

### Non-negotiable constraints

1. Rs 0 implementation and growth budget: free tiers, existing stack, open-source libraries and free assets only.
2. IST everywhere. Persist timestamps in UTC where technically appropriate, but display and schedule using `Asia/Kolkata`.
3. Full-width layouts. Do not force the application into a narrow centred column.
4. No native date/time pickers or native dropdowns; use accessible custom controls.
5. Never invent users, online counts, testimonials, rankings, learning outcomes or savings claims.
6. Coins cannot be purchased or cashed out. No loot boxes, wagering, real-money stakes or pay-to-win.
7. Scores must be server-graded. Answer keys must never be sent to the browser before the permitted reveal point.
8. Tease paid features with honest samples; do not hard-lock the core free learning experience.
9. No automatic subscription renewal. Use only prices and plan terms in the supplied context.
10. Test desktop and phone in light and dark modes. Target 60 fps on a mid-range Android device.
11. Keyboard, screen-reader, visible-focus, sufficient target size and reduced-motion support are release requirements.
12. Keep private owner-only Interview Preparation out of student navigation and student feature recommendations.

### Evidence and uncertainty

Product facts and business numbers below come from the supplied RENYXERA context. No external analytics, user interviews, repository inspection or live-site audit was performed for this document. Statements such as “a student may struggle with…” are **expected friction hypotheses**, not observed research findings. Validate them with event data, support messages and short usability sessions before treating them as proven.

---

# 1. Product audit — likely student friction and fixes

Each module has three likely student-facing problems and concrete fixes. These are hypotheses, not claims that every student experiences them.

## 1.1 Practice, official PYQs and exam-identical session

**LIVE:** About 3,250 official past-paper questions from 2017–2026 across CS, EC, EE, ME, CE and DA; CS verified against official papers. Exam session includes timer, palette, mark for review, save/next, submit confirmation, GATE-style scientific calculator, fullscreen and integrity signals. Tab switches are counted but do not alter marks. Grading is server-side. Results, review with available solutions, Mistakes Bank, bookmarks, notes, revision sessions, spaced-repetition flashcards, checkpoint quiz and diagnostics exist.

1. **Likely friction — unfamiliar users may not know which practice entry matches their immediate goal.** PYQs, practice, mocks, revision and custom tests can feel like separate destinations. **Fix:** Add a “What are you here to do?” entry layer with three routes: *Attempt a paper*, *Practise a subject or topic*, *Review mistakes*. Do not add a recommendation engine unless the data exists.
2. **Likely friction — exam rules may be remembered incorrectly.** MCQ negative marking, MSQ all-or-nothing and NAT tolerance differ. **Fix:** Put a compact “Marking for this question” label near question metadata, with the exact rule for that type; keep full instructions available from Help.
3. **Likely friction — students may complete a test but not convert the result into a useful next step.** **Fix:** Show follow-ups supported by actual data: review wrong answers, add selected mistakes to revision, or practise the weakest measured topic. If the sample is too small, say “Not enough attempts yet.”

**Implementation safeguard:** Keep the exam engine and server grading authoritative. A UI redesign must not change question order, save behaviour, answer validation, calculator behaviour or integrity policy without regression tests.

## 1.2 Test Centre

**LIVE:** Build a test, Practice, Mocks and History. Deployment types: Official Year Paper, Section Sprint, Subject Mastery, Topic Spotlight and Custom Advanced Generator. Sources: GATE PYQs, Forge, Spark and Blend. **PENDING:** Official Year Paper currently only for PYQ; Forge cannot yet be placed inside built tests because the exam screen does not grade Forge answers; Blend needs a scope-aware redesign with presets and in-scope Spark.

1. **Likely friction — users choose a source before understanding the test format.** **Fix:** Start with task (full paper / short sprint / subject / topic / custom), then show eligible sources for that scope.
2. **Likely friction — Forge/Blend capability gaps create misleading expectations.** **Fix:** Disable impossible combinations with an inline explanation and route to the relevant Forge page. Never silently substitute PYQs for Forge. Label every source.
3. **Likely friction — the hub feels like a catalogue rather than a next action.** **Fix:** Give the page one primary “Build a test” action and secondary “Continue practice”, “View mocks” and “History” entries.

## 1.3 Test builder — PYQ, Forge, Spark and Blend

**LIVE:** Builder and deployment types. **PENDING:** Forge inclusion and proper Blend redesign; Forge answers are server-side but the exam screen does not currently grade Forge answers.

1. **Likely friction — source, scope and deployment are mixed together.** **Fix:** Separate into *What are you practising?* (scope), *How should the test feel?* (deployment), *Where should questions come from?* (source), with a live summary.
2. **Likely friction — a configuration may only fail after setup.** **Fix:** Use server-provided availability. State “Forge questions cannot yet be graded inside custom tests.” Never silently replace the selected source.
3. **Likely friction — Custom Advanced Generator may expose too much at once.** **Fix:** Offer a clear default and progressively disclose advanced controls. Show source mix and question distribution.

**Build order:** Finish the server grading path for Forge in the exam engine, then make Forge eligible in builder scopes. Redesign Blend only after eligibility is queryable by paper, topic and scope. Do not imply content availability that does not exist.

## 1.4 Forge — original GATE-level questions

**LIVE:** 329 CS questions with computed answers, worked solutions, shortcuts and trap notes. Other papers are not yet available. Free gets a fixed taster of 10 plus Forge Mocks results/ranks only; Plus gets 15/day with worked solutions; Pro gets unlimited including X tier and archive. **PLANNED:** Grow CS to 800, Daily Forge, Forge Mock schedule, Telegram teaser and calibration loop.

1. **Likely friction — EC/EE/ME/CE/DA students may expect the same coverage as CS.** **Fix:** Show per-paper availability, e.g. “CS: 329 available” and “EC: not available yet”; do not invent dates.
2. **Likely friction — users may not know how Forge differs from PYQs.** **Fix:** “Official PYQs are past GATE questions. Forge contains original questions written and verified by RENYXERA.” Label every card and result.
3. **Likely friction — daily limits and solution access feel arbitrary.** **Fix:** Show allowance before starting and what happens at the limit. No fake countdowns or “almost gone” urgency.

**Quality safeguard:** Keep question version, computed answer, tolerance, solution, shortcut and trap note traceable to an internal question ID. Preserve code verification and owner review; AI generation alone is not a quality gate.

## 1.5 Spark — student-generated AI questions

**LIVE:** Students generate AI practice questions; Plus 5 sets/day, Pro unlimited; saved on device; usable in tests and flashcards.

1. **Likely friction — Spark questions may be mistaken for official GATE questions.** **Fix:** Persistent “AI-generated practice” source label on every question, test and flashcard.
2. **Likely friction — local content may feel unsafe across devices/browser clearing.** **Fix:** Say “Saved on this device.” Offer export/sync only if actually implemented; do not promise cloud sync.
3. **Likely friction — generated question quality varies.** **Fix:** Add report reasons (incorrect answer, ambiguous wording, wrong topic, invalid options). Store content hash and model/prompt version where feasible.

## 1.6 AI Mentor

**LIVE:** Chat history, groups, search, edit with versions, stop, multi-device sync, maths/code/tables and disclaimer. Mentor reads student data (weak topics, recent mistakes, goals, last test) to explain, plan, quiz and review. Dashboard, goals, roadmap, daily check-in, focus timer, AI Tutor, practice sets and revision sheets exist. Free 5 requests; Plus 75/day; Pro 150/day. Recharge packs and coin-shop boosts exist. Gemini/OpenRouter free-tier models are server-only; quotas, caching and nightly pre-generation are used. **PLANNED:** Streaming, photo doubts, weak-topic memory and Mentor rebuild items.

1. **Likely friction — students do not know whether to ask open chat or use a contextual tool.** **Fix:** Provide intent actions: explain a question, make a practice set, review mistakes, plan today. Disclose relevant personal context use.
2. **Likely friction — AI answer may be mistaken for an official solution.** **Fix:** Distinguish official answer/marking, verified worked solution and AI explanation. Show which source question is being discussed.
3. **Likely friction — quota limit interrupts a task without recovery.** **Fix:** Show remaining requests and reset time only if confirmed; preserve draft; offer non-AI alternatives such as saved solutions and revision.

**Reliability safeguard:** Show clear model outage/rate-limit states. Do not pretend a failed request produced an answer. Do not label cached/pre-generated content unless the distinction matters and is accurate.

## 1.7 Planner and analytics

**LIVE:** Planner calendar/to-dos, goals slider, GATE 2027 countdown, heatmap, Mistake DNA, coach insights, readiness estimate calibrated on official 2023–2026 data. Analytics sections: What to do next, Subjects, Topics, Over time, coach insights; Pro analytics includes mock history, topic ladders and difficulty. Metrics include questions solved, accuracy, time/question vs GATE pace, skip rate, streak, hours and subject metrics; HUD gauges include mastery/readiness/confidence/consistency.

1. **Likely friction — many metrics compete with the next action.** **Fix:** Lead with one recommended action, one reason and estimated effort; keep detail below.
2. **Likely friction — readiness/mastery appears more precise than sample supports.** **Fix:** Show sample size and updated date. Use “early estimate” or “not enough attempts” when appropriate. Explain basis plainly.
3. **Likely friction — charts are difficult to compare on a phone.** **Fix:** One full-width chart per mobile section with a concise insight and accessible data table; desktop may compare multiple analysis regions.

## 1.8 Study materials reader

**PLANNED paid product, preview live.** Lessons are intended to include frequency/relevance, concept, definition, worked example, trap, self-check and linked PYQs. Free taster: Operating Systems > Deadlock. Reader concept includes scroll-following contents, side rail, four highlight colours and synced typed notes. Packs Rs 99–149 plus bundles, one-time; no refunds except RENYXERA errors; English first; CS accuracy review; private repo/bucket; Phase 0 pending.

1. **Likely friction — preview mistaken for a complete library.** **Fix:** Mark sample chapters and availability honestly; no fabricated release dates.
2. **Likely friction — long lesson hard to navigate on phone.** **Fix:** Sticky compact section title and collapsible contents sheet on phone; full-height contents rail on desktop.
3. **Likely friction — highlights/notes confused with bookmarks or synced notes.** **Fix:** Label each action and sync state. Say “Saved on this device” until sync is confirmed.

## 1.9 Solutions

**LIVE:** Many PYQs have solutions; AI solutions pre-generated nightly within free quotas (about 300 in 8 days in supplied context). Goal of a worked solution for every question is PENDING at scale.

1. **Likely friction — inconsistent availability.** **Fix:** Show “Solution available” or “Solution not available yet” before opening the panel.
2. **Likely friction — official marking and explanatory method are conflated.** **Fix:** Show answer/marking first, then worked method; label provenance where known.
3. **Likely friction — long explanation is hard to scan during mistake review.** **Fix:** Structure as Key idea, Steps, Why an approach fails, Remember; never truncate derivations.

## 1.10 Battles and Arena

**LIVE:** Friends by username/presence, async challenge up to 7 days, live shared 6-second countdown, scheduled challenge within 7 days with do-not-disturb during tests, answered counts every 5 seconds, VS strip, result board, rematch and subject comparison. Arena: Elo 1000/K=24; points win 30/draw 15/loss 8; max 10 point-earning battles/day; weekly/all-time friend/everyone leaderboards; four-week seasons; first ends 30 Nov 2026. Coins/shop, clubs, avatars/plans exist. Current lobby-card UI was rejected. **PROPOSED/PENDING:** Full-screen mode, ranked random matchmaking, engineering tiers, XP/levels, missions, badges, free season track, Quick Clash, emotes and share cards.

1. **Likely friction — lobby card inside site does not feel like a separate game.** **Fix:** Build full-screen Battles shell with its own navigation, transitions and “Exit to study”; hide main navbar/dock/banners/footer.
2. **Likely friction — Arena progression not visible enough.** **Fix:** Put rating, season position, tier and next milestone on game home. Do not advertise random matchmaking until queue and honest no-opponent state ship.
3. **Likely friction — scoring and rewards opaque.** **Fix:** Explain GATE marks, match completion, point limits and coin rewards before and after a match. No purchasable advantage or wagering.

**V1 caution:** Reuse live friends/challenges/scheduling/scoring/rating/points/reward logic. Audit and adapt; do not rebuild trusted backend without evidence.

## 1.11 Design system and shell

**LIVE:** Floating desktop navbar island and phone dock; pastel cards with watermarks; Sora, Manrope, Bruno Ace SC; violet-blue folded-ribbon R. Dark redesign active. Edge has neutral charcoal cards, 2px coloured stripe, coloured title/watermarks; Midnight and Tinted alternatives. Owner dislikes saturated blocks, muddy tints, plain charcoal and straight swaps; current dark still looks poor. Five premium Looks live for Pro; ten on hold. Profile includes personal info, avatar/design studio, goals, preferences, security, plans, Telegram, devices, storage; college picker about 69,000 institutions. Dashboard has headline/readiness/KPIs/today plan/timer/toolkit/challenge banner.

1. **Likely friction — repeated pastel cards make modules look identical.** **Fix:** Type-led layouts, one signature visual per screen, pastel as grouping accent rather than default container.
2. **Likely friction — dark mode feels recoloured rather than designed.** **Fix:** Build separate surface/elevation system, desaturated semantic accents, stronger hierarchy; avoid muddy overlays and stripe on every panel.
3. **Likely friction — navigation exposes too many destinations/tools.** **Fix:** Preserve primary destinations, move infrequent tools into labelled More/Tools; show Interview only to allowed accounts; avoid duplicated navigation.

## 1.12 Public site and SEO

**LIVE per supplied context:** Branch landing pages, past-paper/question pages, syllabus/topic pages, GATE changes, cutoff tool, score calculator, study-plan tool, comparison and legal pages.

1. **Likely friction — landing pages may not show whether content is official/current/relevant.** **Fix:** Put paper, year range, verified count, source and last-reviewed date near top.
2. **Likely friction — a question-page visitor may not know next action.** **Fix:** Add a contextual practice/full-paper route only where route and access genuinely exist.
3. **Likely friction — date-sensitive content becomes stale.** **Fix:** Add reviewed dates and a March 2027 official-data refresh checklist; separate evergreen guidance from dated facts.

## 1.13 Growth and channels

**LIVE per supplied context:** visit-to-payment tracking, tagged-link builder, funnel report, admin-lite; Telegram hub + six branch channels posting one PYQ/day; Instagram publisher built but account setup pending; YouTube channel exists but no video; referral gives both users 7 Pro days when referred friend completes first test; consent-based result/challenge share cards. A 68-second “Why.” ad video is rendered and ON HOLD.

1. **Likely friction — impressions may not translate to first test starts.** **Fix:** Tag post links and measure landing → paper selection → test start → completion; use branch-specific examples.
2. **Likely friction — daily Telegram question can become noise without learning payoff.** **Fix:** Question, later answer reveal, brief explanation, topic and tagged practice link; only promise cadence that can be maintained.
3. **Likely friction — social publishing blocked by account setup.** **Fix:** Complete Instagram setup, publish one real screen-recorded walkthrough, reuse it as YouTube Short; keep ad video on hold until owner approves.

## 1.14 Plans and payments

**LIVE per supplied context:** Free, Plus Rs 29/month or Rs 249/year, Pro Rs 99/month or Rs 799/year, date-priced season pass, no auto-renew, no free trial/lifetime plan, prorated Plus→Pro, coupons/receipts. Razorpay disabled. Provider layer supports Cashfree and other slots; Cashfree recommended in supplied context subject to stated eligibility; owner still needs signup and keys. Free includes substantial core practice, mocks, analytics, revision, cloud sync, Telegram reminders, Forge taster and AI taster.

1. **Likely friction — users may not understand what stays free.** **Fix:** Put Free first and show core inclusions; paid plans show exact incremental limits.
2. **Likely friction — no auto-renew may be hidden.** **Fix:** Place “No automatic renewal” beside price and checkout action; explain expiry.
3. **Likely friction — payment setup unfinished.** **Fix:** Do not show active checkout until provider is configured and sandbox/live-tested. Use honest “Payments are being set up.”

---

# 2. Feature suggestions — 22 proposals for Rs 0

Effort is relative to one developer using Claude Code, not a delivery guarantee. Plan means proposed availability; do not alter entitlements without owner approval.

## 2.1 Quick wins (under one developer day, subject to code audit)

| # | Feature | Student value | Effort | Plan | Claude Code skills |
|---|---|---|---|---|---|
| 1 | Contextual next-action strip on results | Turns score into relevant next step | S | Free | `interface-design`, `ux-writing`, `product-management:write-spec` |
| 2 | PYQ/Forge/Spark/Blend source badges | Prevents source confusion | S | All | `interface-design`, `design-skills:ux-writing` |
| 3 | Solution availability label | Avoids empty solution panel | S | All | `ux-writing`, `interaction-design` |
| 4 | Remaining Mentor request indicator | Helps plan around quota | S | All | `interface-design`, `ux-writing` |
| 5 | “Saved on this device” local-state indicator | Makes storage behaviour clear | S | All | `interface-design`, `accessibility-audit` |
| 6 | UTM naming convention and channel templates | Makes existing tracking useful | S | Internal | `marketing:campaign-plan`, `metrics-review` |
| 7 | Per-paper Forge availability summary | Prevents false expectation outside CS | S | All | `interface-design`, `ux-writing` |
| 8 | Empty/error/loading-state pass in Test Centre | Reduces dead ends | S | All | `unslop`, `design-critique` |
| 9 | Desktop exam keyboard shortcut help | Improves efficient use | S | All | `interaction-design`, `accessibility-review` |
| 10 | Last-reviewed label on date-sensitive SEO pages | Builds trust around changing facts | S | Public | `seo-audit`, `ux-writing` |
| 11 | One-click share from existing result data | Makes user-initiated sharing easier | S/M | All, subject to current capability | `interface-design`, `accessibility-audit` |
| 12 | Analytics sample-size labels | Prevents overconfidence in small samples | S | All | `dataviz`, `interface-design` |

## 2.2 Medium and larger bets

| # | Feature | Student value | Effort | Plan | Claude Code skills |
|---|---|---|---|---|---|
| 13 | Mistake-to-revision flow with due date | Builds revisit habit | M | Free core; preserve current entitlement | `journey-mapping`, `interaction-design`, `interface-design` |
| 14 | Test-builder capability matrix | Makes valid combinations obvious | M | All | `write-spec`, `interface-design`, `systematic-debugging` |
| 15 | Blend preset redesign from actual inventory | Prevents impossible combinations | M/L | Existing plan rules; confirm | `ux-research`, `write-spec`, `interaction-design` |
| 16 | Forge server grading in built tests | Enables broader Forge practice formats | L | Existing Free/Plus/Pro rules | `systematic-debugging`, `verification-before-completion`, `write-spec` |
| 17 | Full-screen Battles shell | Addresses explicit rejection of lobby dashboard | L | Existing eligibility/rules | `frontend-design`, `hallmark`, `interface-design`, `design-critique` |
| 18 | Dark mode rebuilt as its own surface system | Improves visual quality and reading | M/L | All | `frontend-design`, `unslop`, `design-elevation`, `accessibility-audit` |
| 19 | Mentor task-first entry actions | Makes contextual tutor tools discoverable | M | Existing allowances | `journey-mapping`, `ux-strategy`, `interface-design` |
| 20 | Study Materials Phase 0 reader | Tests lesson value with Deadlock sample | L | Free sample; paid packs when approved | `frontend-design`, `interaction-design`, `accessibility-audit` |
| 21 | Branch-specific weekly content workflow | Improves organic distribution | M | Free growth | `content-creation`, `social-content-engine`, `campaign-plan` |
| 22 | Funnel cohort report | Finds first-test and return drop-offs | M | Internal | `metrics-review`, `dataviz`, `write-spec` |

**Recommended order:** first-test conversion and clarity; high-trust infrastructure (payments, Forge grading, Blend eligibility, privacy, rate limits); Battles shell reusing live systems; dark mode after screenshot testing; Study Materials Phase 0 only after lesson quality and checkout/protection decisions.

**Do not prioritise yet:** public student chat, complex social feed, paid battle pass, new currency, AI motivational notifications, another chatbot persona or app-store packaging before revenue. They add moderation and maintenance without addressing the clearest bottlenecks.

---

# 3. UI/UX upgrade plan per screen — full specification

## Shared screen rules

- Build on the actual routes/components after code audit; the component names below are proposals, not claims that they exist.
- Sora for display/numeric emphasis, Manrope for body and controls, Bruno Ace SC only for the wordmark.
- Sentence case labels; do not repeat tracked uppercase eyebrow labels.
- Desktop uses the full width at 1440px+. Use a left rail and broad work area, not a narrow centre column.
- Mobile assumes 390px portrait, safe areas and one-handed use. Important actions cannot depend on hover.
- Use 44×44 CSS px as the product target for frequent touch controls. WCAG 2.2 AA's minimum target-size criterion is 24×24 CSS px subject to exceptions; 44px is a stronger product usability choice [R2][R3].
- Use semantic controls, persistent labels, focus management and announcements. Respect reduced motion [R4].
- Loading, empty, error, disabled and offline states are part of each screen's definition.
- Any mock data in a prototype must be labelled “Example”.

## 3.1 Dashboard

**Goal:** Help the student decide what to do today and start quickly. It is a learning workspace, not an analytics report.

**(a) Problems/evidence:** KPI tiles, toolkit cards and challenge banners may compete with the next action; readiness may look more definitive than an estimate; Battles banner may displace study. These are hypotheses to validate. Apply visibility of system status, recognition over recall and minimalist hierarchy [R1].

**Keep:** Keep the existing dashboard identity, goal slider, timer, today plan, toolkit and real readiness/analytics data.  
**Change:** Change the hierarchy so one evidence-backed next action leads; reduce competing KPI tiles and challenge promotion.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ RENYXERA              [avatar]│
│ Good evening                 │
│ Your GATE plan for today     │
│                              │
│ NEXT ACTION                  │
│ Revise deadlocks             │
│ Why: 3 recent mistakes       │
│ [Start 15-minute review]     │
│                              │
│ Readiness [gauge] · Updated  │
│ sample size / accuracy       │
│                              │
│ TODAY: plan rows + timer     │
│ YOUR PROGRESS: key numbers   │
│ TOOLKIT: Test / Mentor / Review│
│                              │
│ [Home][Test][Review][Mentor] │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV ISLAND   │ Personal headline / GATE 2027 context                     │
│ Dashboard    ├──────────────────────────────────────┬─────────────────────┤
│ Test Centre  │ NEXT ACTION + reason + CTA           │ READINESS + sample  │
│ Study        ├──────────────────────────────────────┴─────────────────────┤
│ AI Mentor    │ TODAY PLAN (wide timeline)       │ Study timer / goals  │
│ Battles      ├──────────────────────────────────┴─────────────────────────┤
│ Review       │ KPI strip: questions · accuracy · pace · skip rate         │
│ Analytics    ├─────────────────────────────┬──────────────────────────────┤
│              │ Subject/topic signal       │ Toolkit / recent activity   │
└──────────────┴─────────────────────────────┴──────────────────────────────┘
```

Phone anchors one real study action and stacks information. Desktop uses two broad work zones and a wider plan. Do not stack every section into a 700px column.

**(c) Signature:** “Next-action instrument”: what to do, why, and estimated effort; based only on real data with a low-sample fallback.

**(d) Components/states:** `DashboardHeader`, `NextAction`, `ReadinessSummary`, `TodayPlan`, `StudyTimer`, `ProgressStrip`, `ToolkitDeck`, `ChallengeEntry`. States: no plan, no attempts, stale data, partial offline, loading, analytics failure.

**(e) Tokens:** Light: canvas `#F7F7FB`, surface `#FFFFFF`, quiet `#F1F2F8`, text `#20243A`, secondary `#626A80`, border `#E1E5EF`, CTA `#625FC3`, mint `#E9F5EF`/`#28634F`, caution `#FBF3DC`/`#725B24`. Dark: canvas `#11151E`, surface `#191F2B`, raised `#222B3A`, border `#354154`, text `#F1F3F8`, secondary `#AAB5C7`, CTA `#AAA6F3`, mint `#20352F`/`#A5D7C2`. Type: greeting 24–28/30–34 Sora; section 18/24 Sora; body 14/21 Manrope; metrics 24/30 Sora tabular.

**(f) Motion:** page opacity 180ms; CTA press 100ms; readiness value 250ms only on data change; no continuous gauge animation; reduced-motion uses immediate state.

**(g) Copy:** “Your plan for today”; “Start this task”; “You have not added a study task for today.”; “Add a task”; “Complete a test to build your readiness estimate.”; “Based on your attempts through [date].”; “Open Battles”; “Your dashboard could not load. Your saved study data has not been changed.”

**(h) Accessibility:** Gauge has textual equivalent only with real inputs; list alternative for timeline; focus order follows reading order; no colour-only task status.

**(i) Avoid AI slop:** No six identical pastel KPI cards, decorative blobs or repeated uppercase captions. Use one purposeful next-action graphic and varied density.

**(j) Skills:** `interface-design`, `design-skills:design-critique`, `dataviz`, `design-skills:ux-writing`, `design:accessibility-review`.

**(k) Owner confirmation:** next-action data availability; hide/reorder permissions; whether challenge banner is optional; readiness detail for all plans.

## 3.2 Test Centre

**Goal:** Choose an exam activity without learning internal taxonomy.

**(a) Problems/evidence:** Build/Practice/Mocks/History may look equally important; source differences are unclear; known Forge grading and Blend gaps must be represented honestly.

**Keep:** Keep Build, Practice, Mocks, History and the existing All-India Mock entry.  
**Change:** Change the information architecture so the task comes before source taxonomy and unsupported combinations are explained.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Test centre                  │
│ WHAT DO YOU WANT TO DO?      │
│ Build a test                 │
│ Choose paper, scope and type │
│ [Build test]                 │
│                              │
│ PRACTISE                     │
│ Topic / subject / PYQ        │
│ ALL-INDIA MOCK: live status  │
│ [View mock]                  │
│ Your recent tests / History  │
│ [Home][Test][Review][Mentor] │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ Test centre                                                │
│              ├────────────────────────────────────────────────────────────┤
│              │ PRIMARY: Build a test / selected paper                     │
│              ├──────────────────────────────┬─────────────────────────────┤
│              │ Practise by topic / subject  │ All-India Mock status       │
│              ├──────────────────────────────┴─────────────────────────────┤
│              │ Recent tests and history table                             │
└──────────────┴────────────────────────────────────────────────────────────┘
```

Phone emphasises one entry action and compact sections. Desktop shows broad history rows and mock status without a narrow column.

**(c) Signature:** Activity selector: Build / Practise / Mock, with short explanations. Source selection occurs inside the relevant flow.

**(d) Components/states:** `TestCentreHeader`, `ActivitySwitcher`, `BuildTestEntry`, `PracticeEntry`, `MockStatusPanel`, `RecentTestList`, `SourceAvailabilityNote`. States: no history, mock status unavailable, missing paper data, network failure, Forge unsupported in builder, no questions in scope.

**(e) Tokens:** Light `#F7F7FB` canvas, `#FFFFFF` surface, `#E1E5EF` border, `#20243A` text, `#625FC3` active; source fills PYQ `#EAF3FC`, Forge `#EAF5EF`, Spark `#F1EDFA`, Blend `#FBF3DF`, each with dark readable ink. Dark canvas `#11151E`, surface `#191F2B`, raised `#222B3A`, text `#F1F3F8`, border `#354154`, subdued source fills. Type 26/32 Sora page, 18/24 section, 14/21 body.

**(f) Motion:** tab indicator 160ms; build opens 180ms; no auto-carousel; reduced motion instant.

**(g) Copy:** “Test centre”; “What do you want to do?”; “Build a test”; “Practise a subject or topic”; “All-India mock”; “Your test history”; “Your completed tests will appear here.”; “Forge questions are not available in built tests yet. You can open Forge to practise them.”; “This mix is not available for the selected scope.”

**(h) Accessibility:** Correct tab semantics only if arrow-key support exists; mock status in text, not dot; source info available on focus and tap; preserve focus on return.

**(i) Avoid AI slop:** Do not use four identical pastel cards. Use primary Build action, compact mock strip and dense history table.

**(j) Skills:** `interface-design`, `journey-mapping`, `design-skills:interaction-design`, `design-critique`, `ux-writing`, `accessibility-audit`.

**(k) Owner confirmation:** remember last paper/scope? mock status API reliability? which practice shortcuts remain top-level?

## 3.3 Test builder — Blend, Forge and Spark

**Goal:** Create a valid test while understanding scope, format and source.

**(a) Problems/evidence:** Forge grading not available in exam screen; Blend scope/preset availability pending; mixing source, scope and type risks errors.

**Keep:** Keep all existing deployment types and existing PYQ/Spark/Forge/Blend concepts.  
**Change:** Change setup into scope → format → source, driven by server capability and inventory.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Build a test · Step 1 of 3   │
│ 1. Scope                     │
│ [Paper: CS] [Subject] [Topic]│
│ 2. Format                    │
│ Official year / Sprint       │
│ Subject mastery / Spotlight  │
│ Custom advanced              │
│ 3. Question source           │
│ PYQ · Forge · Spark · Blend  │
│ Availability and limits      │
│ Test summary                 │
│ [Review test settings]       │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ Build a test                                               │
│              ├──────────────────────────────┬─────────────────────────────┤
│              │ 1. Scope                    │ 2. Format                   │
│              ├──────────────────────────────┴─────────────────────────────┤
│              │ 3. Source matrix: PYQ / Forge / Spark / Blend               │
│              ├────────────────────────────────────────────────────────────┤
│              │ Test summary: counts, marks, duration, source mix           │
└──────────────┴────────────────────────────────────────────────────────────┘
```

Phone uses progressive steps and bottom Continue; desktop shows zones together with summary.

**(c) Signature:** Capability-aware source matrix using server availability. Never infer from client count or silently substitute source.

**(d) Components/states:** `ScopePicker`, `DeploymentTypePicker`, `SourceMatrix`, `BlendComposer`, `AvailabilitySummary`, `TestSummary`, `ValidationMessage`. States: loading inventory, no questions, source unsupported, Spark local set missing, invalid Blend total, inventory changed, generation failed, saved configuration.

**(e) Tokens:** Light surface `#FFFFFF`, canvas `#F7F7FB`, field `#F3F4FA`, focus `#625FC3`, disabled `#8A90A1`, error `#A6414B`, valid `#28634F`. Dark canvas `#11151E`, field `#222B3A`, raised `#293447`, border `#48566D`, focus `#AAA6F3`, disabled `#778399`, error `#E69AA0`, valid `#A5D7C2`. Labels 13/18 Manrope; values 15/22; step title 20/26 Sora.

**(f) Motion:** step 180ms; selected source border/check change without bounce; announce Blend total; reduced motion instant.

**(g) Copy:** “Choose your paper”; “Choose a scope”; “Choose the test format”; “Choose question sources”; “Available for this scope”; “Not available for this scope”; “Forge is not yet supported in built tests.”; “Spark questions are saved on this device.”; “Your source mix must add up to 100%.”; “No questions match these settings.”; “Review test settings”; “Start test”.

**(h) Accessibility:** Custom dropdown keyboard support; percent inputs have numeric alternative; availability not colour-only; focus first invalid field; no drag-only setup.

**(i) Avoid AI slop:** Not a generic numbered-card wizard. Use real configuration workspace with source matrix and composition summary.

**(j) Skills:** `product-management:write-spec`, `interface-design`, `interaction-design`, `systematic-debugging`, `verification-before-completion`, `accessibility-audit`.

**(k) Owner confirmation:** Blend presets; adjustable source ratios by mode; unified server capability response; question/time defaults per deployment.

## 3.4 Exam screen

**Goal:** Answer accurately under GATE-like conditions with minimal distraction.

**(a) Problems/evidence:** Existing timer, palette, review mark, save/next, submit, calculator and fullscreen must be preserved. Phone viewport constrains maths/options. Saved/marked/submitted states need clear feedback.

**Keep:** Keep the exam-identical engine, timer, palette, mark-for-review, calculator, fullscreen, save/next and server grading.  
**Change:** Change only layout, responsive controls and state feedback; do not change exam rules or trusted answer submission.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ GATE PRACTICE     01:42:18   │
│ Q 12 of 65      [palette]    │
├──────────────────────────────┤
│ 12 · 1 mark · MCQ            │
│ Question statement...        │
│ [math / diagram / code]      │
│ ○ Option A                   │
│ ○ Option B                   │
│ ○ Option C                   │
│ ○ Option D                   │
├──────────────────────────────┤
│ [Mark for review] [Save]     │
│ [Previous]       [Save next] │
└──────────────────────────────┘
```

DESKTOP:
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ GATE PRACTICE · CS       TIMER 01:42:18          Calculator  Fullscreen     │
├──────────────┬───────────────────────────────────────────────┬─────────────┤
│ QUESTION     │ 12 · 2 marks · MSQ                            │ QUESTION    │
│ PALETTE      │ Statement / image / maths / code               │ STATUS KEY  │
│ 1 2 3 4 5    │ Answer options / numeric entry                │             │
│ ...          │                                               │             │
├──────────────┴───────────────────────────────────────────────┴─────────────┤
│ Mark for review      Previous       Save & next       Submit test          │
└────────────────────────────────────────────────────────────────────────────┘
```

Phone palette becomes a sheet; timer remains visible; actions anchor bottom. Desktop keeps palette rail and wider question workspace.

**(c) Signature:** Paper-like question workspace with question number, type, marks, statement and answer control. Palette is navigation, not decoration.

**(d) Components/states:** `ExamHeader`, `QuestionMeta`, `QuestionBody`, `AnswerControl`, `QuestionPalette`, `ExamFooter`, `IntegrityStatus`. States: loading, saved, save pending, offline, save failed, low time, submitted, review mode, calculator open, palette open.

**(e) Tokens:** Light canvas `#F7F7F8`, paper `#FFFFFF`, text `#20243A`, muted `#626A80`, selected option `#EEF0FC` + `#625FC3`, saved mint `#EAF5EF`, marked butter `#FBF3DF`. Dark canvas `#11151E`, paper `#1A202B`, option `#242D3B`, text `#F1F3F8`, muted `#AAB5C7`, selected `#343451` + `#AAA6F3`, status `#20352F`/`#3A3322`. Question 16/26 Manrope; timer 18/24 Sora tabular.

**(f) Motion:** selection 100ms, save state 120ms, palette sheet 180ms; no flashing timer; reduced motion immediate.

**(g) Copy:** “Mark for review”; “Saved”; “Save & next”; “Previous”; “Question palette”; “Your answer could not be saved. Check your connection and try again.”; “Submit test”; confirmation: “Submit this test? You will not be able to change your answers after submission.”

**(h) Accessibility:** Inputs labelled; radio groups have fieldset/legend; shortcuts do not steal keys from inputs/screen readers; palette has text status; focus follows question; MathJax has accessible alternative; do not announce timer every second.

**(i) Avoid AI slop:** No flames, opponent bars or motivational art in ordinary exam. Preserve restrained exam work surface. No animated correct/incorrect feedback during timed exam.

**(j) Skills:** `interface-design`, `interaction-design`, `design:accessibility-review`, `verification-before-completion`, `systematic-debugging`.

**(k) Owner confirmation:** existing shortcuts; ability to stage changes separately from Battles wrapper; time warning thresholds.

## 3.5 Results and review

**Goal:** Explain performance and create the next useful study action.

**(a) Problems/evidence:** Results and review with solutions where available are live; coverage incomplete. Percentage can hide negative marking and skips. Students may confuse marks with accuracy.

**Keep:** Keep current marks, review and solution links where they exist.  
**Change:** Change the result hierarchy to show the GATE marks ledger and an evidence-backed next action before secondary charts.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Test result                  │
│ 46.67 / 100 GATE marks       │
│ Accuracy · time              │
│ Correct / wrong / unanswered │
│ MARKS: earned / deducted / 0 │
│ NEXT: review wrong answers   │
│ [Review mistakes]            │
│ Question-by-question review  │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ Test result · paper · date                                 │
│              ├──────────────────────────────┬─────────────────────────────┤
│              │ GATE marks + ledger         │ Accuracy / time / attempted │
│              ├──────────────────────────────┴─────────────────────────────┤
│              │ Subject/topic performance                                 │
│              ├────────────────────────────────────────────────────────────┤
│              │ Question review table: status · marks · time · solution    │
└──────────────┴────────────────────────────────────────────────────────────┘
```

Phone leads with marks and one action; desktop provides broad breakdown and review table.

**(c) Signature:** “Where the marks went” ledger showing earned, negative and unanswered marks, plus subject/topic distribution only with sufficient sample.

**(d) Components/states:** `ResultHero`, `MarkingLedger`, `PerformanceStrip`, `SubjectBreakdown`, `QuestionReviewList`, `NextActionPanel`. States: grading pending, partial, no solution, insufficient sample, offline cached, share unavailable.

**(e) Tokens:** Light surface `#FFFFFF`; earned `#EAF5EF`; deduction `#FAEDF1`; skipped `#FBF3DF`; text `#20243A`; accent `#625FC3`. Dark surface `#191F2B`; earned `#20352F`; deduction `#3B2730`; skipped `#3A3322`; text `#F1F3F8`; accent `#AAA6F3`. Marks 32/38 Sora tabular; list 14/20 Manrope.

**(f) Motion:** one 200ms reveal; chart bars 250ms once; solution panel 160ms; reduced motion final state.

**(g) Copy:** “Your result”; “GATE marks”; “Marks earned”; “Negative marks”; “Not attempted”; “Review wrong answers”; “Solution available”; “Solution not available yet”; “Not enough attempts to show a topic trend.”; “Continue revision”.

**(h) Accessibility:** Charts have text/table alternative; explicit +/− labels; no colour-only marks; announce result headline once; keyboard-accessible review rows.

**(i) Avoid AI slop:** No fake rank/percentile/comparison or trophy hero. Use transparent marking ledger.

**(j) Skills:** `dataviz`, `interface-design`, `ux-writing`, `design-critique`, `accessibility-audit`.

**(k) Owner confirmation:** accurate result metrics by test type; negative-mark breakdown availability; sharing eligibility per test type.

## 3.6 Mistakes and revision

**Goal:** Revisit mistakes and understand what to do differently next time.

**(a) Problems/evidence:** Mistakes Bank, bookmarks, notes and revision sessions are live. Saved-item types may fragment review; due-date logic may be unclear.

**Keep:** Keep Mistakes Bank, bookmarks, notes and current revision sessions.  
**Change:** Change navigation and review status so saved items become one clear workflow without altering spaced-repetition rules.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Review                       │
│ Mistakes · Bookmarks · Notes │
│ DUE TO REVIEW: 6 questions   │
│ [Start review]               │
│ RECENT MISTAKES              │
│ Question · topic · last try  │
│ [Open] [Mark understood]     │
│ Filter: paper / subject/type │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ Review                                                     │
│              ├────────────────────────────────────────────────────────────┤
│              │ Mistakes | Bookmarks | Notes | Revision                    │
│              ├───────────────────────────────┬────────────────────────────┤
│              │ Filterable question table     │ Due review summary        │
└──────────────┴───────────────────────────────┴────────────────────────────┘
```

**(c) Signature:** A mistake record with selected answer, correct answer when permitted, topic and last review status.

**(d) Components/states:** `ReviewTabs`, `MistakeRow`, `DueReviewPanel`, `ReviewSessionPlayer`, `TopicFilter`, `QuestionTypeFilter`. States: empty, due, caught up, solution unavailable, question updated/removed, paused, offline.

**(e) Tokens:** Light base `#F7F7FB`, surface `#FFFFFF`, selected `#F0EFFB`, wrong `#FAEDF1`/`#883F57`, understood `#EAF5EF`/`#28634F`. Dark base `#11151E`, surface `#191F2B`, selected `#302F4A`, wrong `#3B2730`/`#E6A6B1`, understood `#20352F`/`#A5D7C2`. Page 26/32 Sora; row 14/20 Manrope.

**(f) Motion:** tab 150ms; understood state 140ms without confetti; next question short crossfade; reduced motion immediate.

**(g) Copy:** “Review”; “Mistakes”; “Bookmarks”; “Notes”; “Revision”; “Due to review”; “Start review”; “Mark as understood”; “You are up to date.”; “No mistakes saved yet. Complete a test to build your review list.”

**(h) Accessibility:** Keyboard tabs; filter state announced; swipe never sole interaction; 44px target design goal.

**(i) Avoid AI slop:** Not a generic kanban. Use readable review list and one due-review action; no red flames for mistakes.

**(j) Skills:** `journey-mapping`, `interface-design`, `interaction-design`, `ux-writing`, `accessibility-audit`.

**(k) Owner confirmation:** spaced-repetition interval rules; whether “Mark understood” changes schedule; existing filters.

## 3.7 Flashcards

**Goal:** Active recall without turning setup into another project.

**(a) Problems/evidence:** Flashcards/spaced repetition are live. Provenance of official/user/Spark/generated cards may be unclear; flip-only interaction is inaccessible.

**Keep:** Keep existing flashcard content and spaced-repetition scheduling.  
**Change:** Change the card interaction to an accessible reveal-and-rate pattern and expose source provenance.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Flashcards · 12 due · CS     │
│ CARD 4 OF 12                 │
│ What does deadlock require?  │
│ [Show answer]                │
│ After reveal:                │
│ [Again] [Hard] [Good] [Easy] │
│ [Exit session]               │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ Flashcards · CS · due 12                                   │
│              ├────────────────────────────┬───────────────────────────────┤
│              │ Deck / topic / history     │ Card · prompt · reveal        │
│              │                            │ Again / Hard / Good / Easy     │
└──────────────┴────────────────────────────┴───────────────────────────────┘
```

**(c) Signature:** One clean retrieval card with provenance, prompt and one reveal action.

**(d) Components/states:** `DeckSelector`, `Flashcard`, `RevealAnswer`, `RecallRating`, `SessionProgress`, `SourceBadge`. States: prompt, revealed, rating saved, complete, none due, local set unavailable, loading, content error.

**(e) Tokens:** Light card `#FFFFFF`, canvas `#F7F7FB`, border `#E1E5EF`, text `#20243A`, answer `#EAF3FC`; rating fills mint/butter/rose. Dark card `#222B3A`, canvas `#11151E`, border `#354154`, text `#F1F3F8`, answer `#233344`; muted rating surfaces `#20352F`, `#3A3322`, `#3B2730`. Prompt 21/30 Sora; answer 16/25 Manrope.

**(f) Motion:** Reveal 160ms opacity/short vertical; rating 120ms; no 3D flip; reduced motion immediate.

**(g) Copy:** “Show answer”; “How well did you remember?”; “Again”; “Hard”; “Good”; “Easy”; “End session”; “No cards due right now.”; “This set is saved on this device.”

**(h) Accessibility:** Reveal is a button; answer in DOM after activation; rating has text; no swipe/flip requirement; announce card number and reveal state politely.

**(i) Avoid AI slop:** No glossy 3D trading card, neon border or random badges. Use paper/note visual language.

**(j) Skills:** `interface-design`, `interaction-design`, `design-elevation`, `accessibility-audit`, `ux-writing`.

**(k) Owner confirmation:** Again/Hard/Good/Easy schedule; provenance storage; Spark export/sync.

## 3.8 AI Mentor home

**Goal:** Help a student choose a useful Mentor task from study context and allowance.

**(a) Problems/evidence:** Mentor dashboard/goals/roadmap/check-in/focus timer are live. A blank chat-first screen may underuse context; quotas may be discovered too late.

**Keep:** Keep Mentor goals, roadmap, daily check-in, focus timer, conversation history and current allowances.  
**Change:** Change the entry point from generic chat-first to task-first contextual actions while preserving freeform chat.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ AI Mentor                    │
│ Requests left today: [n]     │
│ WHAT SHOULD WE WORK ON?      │
│ [Explain a question]         │
│ [Review recent mistakes]     │
│ [Make a practice set]        │
│ [Plan today's study]         │
│ YOUR CURRENT FOCUS           │
│ goal · recent topic · last test│
│ Recent chats                 │
│ [Ask the Mentor...]          │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ AI Mentor · allowance                                      │
│              ├──────────────────────────────┬─────────────────────────────┤
│              │ TASK STARTERS                │ STUDY CONTEXT               │
│              │ explain / review / quiz      │ goal · topic · last test    │
│              ├──────────────────────────────┴─────────────────────────────┤
│              │ Recent conversations / groups                             │
│              ├────────────────────────────────────────────────────────────┤
│              │ Ask the Mentor input                                      │
└──────────────┴────────────────────────────────────────────────────────────┘
```

**(c) Signature:** Context-to-task launcher, e.g. “You missed 3 questions on deadlocks. Review them with the Mentor.” Only when real data and consent support it.

**(d) Components/states:** `MentorAllowance`, `MentorTaskLauncher`, `StudyContextSummary`, `ConversationHistory`, `PromptComposer`. States: no context/history, quota reached, model unavailable, offline, context sync, request running.

**(e) Tokens:** Light canvas `#F7F7FB`, surface `#FFFFFF`, focus periwinkle `#EFEEFC`/`#4F4A95`, context mint `#EAF5EF`/`#28634F`, border `#E1E5EF`. Dark canvas `#11151E`, surface `#191F2B`, composer `#222B3A`, focus `#302F4A`/`#C0BCFF`, context `#20352F`/`#A5D7C2`, border `#354154`. Title 24/30 Sora; task 15/22 Manrope.

**(f) Motion:** task selected 120ms; context expand 160ms; static skeleton under reduced motion.

**(g) Copy:** “What should we work on?”; “Explain a question”; “Review recent mistakes”; “Make a practice set”; “Plan today’s study”; “Requests left today: [n]”; “The Mentor is temporarily unavailable. Your study data is unchanged.”; “You have reached today’s request limit. Your draft is still here.” Only say reset is midnight IST if confirmed.

**(h) Accessibility:** Composer always available; disclose contextual data use; polite live regions; keyboard focus returns after task close.

**(i) Avoid AI slop:** No glowing orb as entire identity, gradient blobs or generic prompt-card grid. Ground in actual study tasks.

**(j) Skills:** `journey-mapping`, `ux-strategy`, `interface-design`, `ux-writing`, `accessibility-review`.

**(k) Owner confirmation:** quota reset time; default context fields and opt-out; whether summary retrieval adds model calls.

## 3.9 AI Mentor chat

**Goal:** Support a learning conversation with trust, control and continuity.

**(a) Problems/evidence:** History/groups/search/edit versions/stop/sync/rich formats are live. Streaming/photo doubts/weak-topic memory are planned. Fallback and quotas can feel inconsistent; long maths/code can be hard on phone.

**Keep:** Keep chat history, groups, search, edit/version, stop, sync and rich maths/code/table responses.  
**Change:** Change response hierarchy, quota/error recovery and accessibility; do not fake planned streaming or photo upload.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ ← Mentor chat          [···] │
│ Context: Q18 · Deadlocks    │
├──────────────────────────────┤
│ You: Explain why this...    │
│ Mentor                      │
│ Key idea                    │
│ Worked explanation          │
│ [equation / code / table]   │
│ [Copy] [Helpful?]           │
├──────────────────────────────┤
│ Ask a follow-up...    [Send]│
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────┬───────────────┐
│ CHAT HISTORY │ CONVERSATION                               │ CONTEXT       │
│ groups/search│ messages · maths/code/tables                │ selected Q    │
│ versions     │ copy/edit (if implemented)                  │ recent mistake│
│              ├────────────────────────────────────────────┤ allowance     │
│              │ Composer; attachment only after photo ships │               │
└──────────────┴────────────────────────────────────────────┴───────────────┘
```

**(c) Signature:** Structured explanation “Key idea → steps → check yourself” for learning tasks; normal conversation remains available.

**(d) Components/states:** `ConversationHeader`, `MessageList`, `RichMessage`, `MessageActions`, `Composer`, `ContextChip`. States: sending, streaming only once shipped, stopped, failed, rate-limited, fallback disclosure if accurate, offline draft, synced/conflict.

**(e) Tokens:** Light page `#F7F7FB`, user message `#EFEEFC`, assistant `#FFFFFF`, code `#F0F2F7`, border `#E1E5EF`, text `#20243A`, link `#4D64A7`. Dark page `#11151E`, user `#302F4A`, assistant `#191F2B`, code `#141B25`, border `#354154`, text `#F1F3F8`, link `#AFC8F5`. Body 15/24 Manrope; heading 17/24 Sora; code 13/20 mono.

**(f) Motion:** message insert 120ms fade; Stop immediate; copy status 1.5–2s; no fake streaming; reduced motion no movement.

**(g) Copy:** “Ask a follow-up…”; “Send”; “Stop response”; “Copy answer”; “Copied”; “Edit message”; “View previous version”; “This answer may be incorrect. Check the source question and official marking where available.”; “The Mentor could not respond. Your draft is still here.”; “Try again”.

**(h) Accessibility:** Explicit speaker labels; MathJax alternative; code copy button; horizontal code scroll not whole-page; composer keyboard behaviour clear; batch screen-reader announcements if streaming ships.

**(i) Avoid AI slop:** Do not use identical bubbles for every response, fake avatars, fake confidence labels or invented citations. Use editorially structured explanations.

**(j) Skills:** `interface-design`, `ux-writing`, `interaction-design`, `accessibility-audit`, `systematic-debugging`, `verification-before-completion`.

**(k) Owner confirmation:** version history display; accurate fallback provenance; photo-upload plan and quota feasibility.

## 3.10 Analytics

**Goal:** Show what data says, what it does not yet say, and what action follows.

**(a) Problems/evidence:** Detailed analytics are live. Too many gauges may distract from decisions; readiness/mastery/confidence may look factual when estimated.

**Keep:** Keep current analytics categories, metrics, charts and Pro analytics entitlements.  
**Change:** Change emphasis from dashboard of gauges to evidence-backed next action, with sample size and accessible data alternatives.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Analytics                    │
│ What next · Subjects         │
│ Topics · Over time           │
│ WHAT TO DO NEXT              │
│ One action + why             │
│ [Open action]                │
│ KEY NUMBERS                  │
│ Solved · accuracy · pace     │
│ SUBJECTS: chart / list       │
│ TOPIC EXPLORER: sort/filter  │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ Analytics                                                  │
│              ├────────────────────────────────────────────────────────────┤
│              │ What to do next — full width                               │
│              ├────────────────────────────────┬───────────────────────────┤
│              │ Subjects radar + marks source  │ KPI strip / pace          │
│              ├────────────────────────────────┴───────────────────────────┤
│              │ Topic explorer / trend over time                           │
│              ├────────────────────────────────────────────────────────────┤
│              │ Coach insights / Pro analytics where entitled              │
└──────────────┴────────────────────────────────────────────────────────────┘
```

**(c) Signature:** “What to do next” with evidence line; never recommend when data is too sparse.

**(d) Components/states:** `AnalyticsNav`, `NextActionInsight`, `KpiStrip`, `SubjectRadar` plus table, `TopicExplorer`, `TrendChart`, `CoachInsight`, `ProAnalyticsGate`. States: no attempts, small sample, old/partial data, loading, chart failure, unsupported paper.

**(e) Tokens:** Light canvas `#F7F7FB`, surface `#FFFFFF`, grid `#E7EAF2`, text `#20243A`, muted `#626A80`, series violet `#625FC3`, sky `#4D89BD`, mint `#3D8A70`, peach `#B86F55`, butter `#9A7A34`. Dark canvas `#11151E`, surface `#191F2B`, grid `#344052`, text `#F1F3F8`, muted `#AAB5C7`, series `#AAA6F3`, `#8DB9F0`, `#8FCDB7`, `#E4AA91`, `#DCC183`. Check contrast per chart background.

**(f) Motion:** chart draws once 250ms; filters update without layout jumps; no pulsing radar; reduced motion final state.

**(g) Copy:** “What to do next”; “Based on your recent attempts”; “Not enough attempts yet”; “Questions solved”; “Accuracy”; “Time per question”; “Compared with GATE pace”; “Skip rate”; “Over time”; “Show data table”; “This estimate is based on [n] attempts through [date].”

**(h) Accessibility:** Every chart has table/description; axes/units/date explicit; colour not sole series distinction; keyboard sortable controls expose direction.

**(i) Avoid AI slop:** No 3D gauges, arbitrary rings, unsupported big percentages, rainbow palettes or walls of KPI tiles.

**(j) Skills:** `dataviz`, `interface-design`, `design-critique`, `ux-strategy`, `accessibility-review`.

**(k) Owner confirmation:** formulas for readiness/mastery/confidence/consistency; sample thresholds; plan entitlements.

## 3.11 Study materials reader

**Goal:** Comfortable, focused topic reading with useful navigation and notes.

**(a) Problems/evidence:** Study materials are planned; Operating Systems > Deadlock sample is the free taster. Scroll contents, side rail, four highlight colours and synced notes are concepts, not necessarily shipped. Reader chrome may compete with text on phone.

**Keep:** Keep the approved lesson structure and Deadlock sample content as the initial reader scope.  
**Change:** Change the reading layout to a calm editorial surface with navigable sections and explicit note-sync state; do not imply planned reader features are live.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ ← Operating Systems          │
│ Deadlock · Sample chapter    │
│ [Contents] [Notes]           │
├──────────────────────────────┤
│ Why this matters             │
│ Core idea                    │
│ Definition                   │
│ Worked example               │
│ Highlight selected text      │
│ Trap · Check yourself        │
│ Linked PYQs                  │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬──────────────────────────────────────────┬───────────────────┐
│ LIBRARY      │ READER                                   │ CONTENTS / NOTES  │
│ subject      │ Why it matters · idea · definition        │ scroll-following  │
│ topics       │ worked example · trap · self-check        │ highlights / notes│
└──────────────┴──────────────────────────────────────────┴───────────────────┘
```

**(c) Signature:** Worked example with margin annotation and one highlighted trap.

**(d) Components/states:** `ReaderHeader`, `ContentsSheet/Rail`, `LessonSection`, `WorkedExample`, `TrapNote`, `SelfCheck`, `HighlightToolbar`, `NotesPanel`. States: loading, preview boundary, saving/synced note, offline draft, unavailable chapter, checkout/access.

**(e) Tokens:** Light reader `#FFFEFC`, text `#24283A`, muted `#50586A`, rule `#E6E5E0`, note paper `#F7F5EE`, highlights `#F7E7A8`, `#CFE8DB`, `#DCE8FA`, `#F1D6DF`. Dark reader `#171C25`, example `#222B38`, text `#E9EDF5`, muted `#B2BDCE`, rule `#394454`, notes `#202A35`, highlights `#5B512D`, `#2C5145`, `#2C4562`, `#593744`. Body 16/27 Manrope.

**(f) Motion:** active contents underline 120ms; mobile sheet 180ms; toolbar must not shift text; no auto-scroll fighting user.

**(g) Copy:** “Sample chapter”; “Contents”; “Notes”; “Why this matters”; “Worked example”; “Common trap”; “Check yourself”; “Linked PYQs”; “Saved on this device”; “Synced to your account” only after confirmed sync; “This lesson is a preview. The complete subject pack is not available yet.”

**(h) Accessibility:** Semantic heading outline; contents links preserve focus; highlights not meaning-by-colour only; notes have label/save status; keyboard highlight alternative to text selection.

**(i) Avoid AI slop:** No scroll of identical cards or generic stock illustrations; use editorial typography, worked examples and concept diagrams.

**(j) Skills:** `frontend-design`, `hallmark`, `design-elevation`, `interaction-design`, `accessibility-audit`, `design:ux-copy`.

**(k) Owner confirmation:** note/highlight sync in Phase 0; pack contents/price/refund terms; lesson review workflow; protection/offline rules.

## 3.12 Battles — full-screen game mode

**Goal:** Separate competitive environment while preserving trusted live challenge and GATE grading systems.

**(a) Problems/evidence:** Current live features are listed in section 1.10. Owner explicitly rejected the lobby-card UI as insufficiently game-like. Full-screen mode, ranked random matchmaking, XP, missions, badges, Quick Clash, emotes and tiers are planned/proposed, not live. No fake player activity.

**Keep:** Keep live friends, async/live/scheduled challenges, shared countdown, progress updates, result board, rematch, comparison, Elo, points, coins and clubs.  
**Change:** Change the shell and screen experience; only add ranked queue, tiers, XP, missions, Quick Clash or other proposals after owner approval.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ RENYXERA BATTLES      [coins]│
│ Avatar · level · rating      │
├──────────────────────────────┤
│ ARENA · current tier/rating  │
│ Season position / time left  │
│ [Find ranked match]*         │
│ PLAY                         │
│ [Friend duel] [Quick*]       │
│ [Async]       [Scheduled]    │
│ CHALLENGES: friend tickets   │
│ Daily reward / mission*      │
│ [Home][Arena][Friends][Shop] │
└──────────────────────────────┘
*Proposed, not live until shipped.
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ GAME RAIL    │ PLAYER IDENTITY · LEVEL · COINS · SEASON                   │
│ Home         ├──────────────────────────────────────────┬─────────────────┤
│ Arena        │ ARENA / RANKED ENTRY                     │ CURRENT TIER    │
│ Battles      │ [Find ranked match]*                     │ rating / next   │
│ Friends      ├──────────────────────────────┬───────────┴─────────────────┤
│ Clubs        │ Friend / async / scheduled  │ Daily reward*             │
│ Shop         ├──────────────────────────────┴─────────────────────────────┤
│ Profile      │ Active challenges · recent results · club standing        │
└──────────────┴────────────────────────────────────────────────────────────┘
```

Phone: bottom game nav, one large ranked CTA, stacked tickets, no hover. Desktop: fixed rail, wide Arena, right-side progression/challenges. In-match phone: opponent progress top, question centre, actions bottom. Desktop: question workspace plus opponent status rail.

**(c) Signature:** Arena identity strip (avatar, tier/rating, season progress and one ranked action); in match, synchronized VS/countdown and restrained opponent progress.

**(d) Components/states:** `BattlesShell`, `GameNavigation`, `PlayerIdentity`, `ArenaSummary`, `ChallengeTicket`, `MatchLobby`, `ReadyState`, `ServerCountdown`, `CompetitiveQuestionWrapper`, `OpponentProgress`, `ResultBoard`, `SubjectComparison`, `RewardSummary`. States: no friends/challenges, no opponent, matchmaking unavailable, disconnect/reconnect, scheduled wait, expired async ticket, grading, invalid/cancelled.

**(e) Tokens:** Proposed Midnight Circuit: canvas `#111827`, surface `#1C2740`, elevated `#283653`, periwinkle `#8585E8`, powder blue `#8DB9F0`, champagne `#E6C58C`, soft white `#F2F3FA`. Proposal only; separate from main brand. Folded-ribbon R and violet-blue identity bridge the worlds.

**(f) Motion:** shell entry 450–600ms; VS entry 350–500ms; countdown from server timestamp; selection 100ms; result 300ms; reduced motion removes avatar travel/particles/rings.

**(g) Copy:** “Battles”; “Arena”; “Find ranked match” only once ranked matchmaking ships; “Challenge a friend”; “Waiting for [username]”; “No opponent is available right now. Challenge a friend or return to study.”; “Exit to study”; “Match complete”; “Your result is being checked.”

**(h) Accessibility:** Keyboard controls; meaningful progress announcements only; no rapid flashes or motion-only countdown; sound muted, haptics optional; increased text size; exit confirmation describes ranked consequences.

**(i) Avoid AI slop:** Do not clone 8 Ball Pool artwork, generic neon frames, random flames or card walls. Borrow interaction clarity, not another game's visual identity. Use engineering references sparingly.

**(j) Skills:** `interface-design`, `frontend-design`, `hallmark`, `design-elevation`, `interaction-design`, `unslop`, `design-critique`, `accessibility-audit`, `systematic-debugging`, `verification-before-completion`.

**(k) Owner confirmation:** approve Quick Clash/ranked/tier/XP/missions/badges/season track/emotes and V1 timing; match length/timer; per-paper or cross-paper; season reset; exit penalty; avatar/plan marker visibility.

## 3.13 Profile

**Goal:** Manage identity, preferences, security and plan details without duplicate settings.

**(a) Problems/evidence:** Profile includes personal information, avatar/design studio, goals, preferences, security, plans/payments, Telegram, devices, storage and college picker (~69,000 institutions). Long settings list may hide security; identity, exam profile and visuals are distinct tasks.

**Keep:** Keep all current profile sections, account/security tools, Avatar/Design Studio and college data.  
**Change:** Change the grouping and section navigation to separate identity, exam goals, appearance and account operations.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Profile                      │
│ [avatar] Name · CS           │
│ College · target GATE year   │
│ YOUR PROFILE                 │
│ Personal details · Exam goals│
│ College                      │
│ APPEARANCE                   │
│ Avatar studio · Design studio│
│ Preferences                  │
│ ACCOUNT                      │
│ Security · Devices · Data    │
│ Telegram · Plan & payments   │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ PROFILE SUMMARY                                            │
│              ├───────────────────────┬────────────────────────────────────┤
│              │ PROFILE NAV           │ Selected settings section          │
│              │ personal/goals        │ controls / values / save state     │
│              │ appearance/security   │                                    │
└──────────────┴───────────────────────┴────────────────────────────────────┘
```

**(c) Signature:** Identity header with avatar, display name, paper/goal and current plan only.

**(d) Components/states:** `ProfileHeader`, `ProfileSectionNav`, `PersonalInfoForm`, `ExamGoalForm`, custom `CollegePicker`, `AvatarStudio`, `DesignStudio`, `AccountSecurity`, `DeviceList`, `DataStorage`, `TelegramSettings`, `PlanPaymentSummary`. States: unsaved, saving, validation, session expired, college not found, Telegram disconnected, provider pending.

**(e) Tokens:** Light canvas `#F7F7FB`, surface `#FFFFFF`, group accents mint `#EAF5EF`, sky `#EAF3FC`, peach `#FFF0E9`, periwinkle `#EFEEFC`, text `#20243A`, border `#E1E5EF`. Dark canvas `#11151E`, surface `#191F2B`, raised `#222B3A`, text `#F1F3F8`, muted `#AAB5C7`, border `#354154`. Name 22/28 Sora; section 18/24; body 14/21 Manrope.

**(f) Motion:** section opacity 160ms; save state textual; college search results debounce without jumps.

**(g) Copy:** “Personal details”; “Exam goals”; “College”; “Avatar studio”; “Design studio”; “Account and security”; “Devices”; “Data and storage”; “Plan and payments”; “Changes saved”; “You have unsaved changes.”

**(h) Accessibility:** Persistent visible field labels; custom college picker typeahead/arrow/escape/result count; polite save announcement; sensitive actions clear and explicit.

**(i) Avoid AI slop:** No generic circle-icon settings dashboard. Use section navigation and clear task rows.

**(j) Skills:** `interface-design`, `interaction-design`, `ux-writing`, `accessibility-audit`, `design-critique`.

**(k) Owner confirmation:** editable fields/verification; public/private profile defaults; current Pro Looks; payment status copy while provider is pending.

## 3.14 Plans page

**Goal:** Compare Free, Plus and Pro honestly and pay only when paid value is relevant.

**(a) Problems/evidence:** Prices/benefits supplied; provider setup incomplete (Razorpay disabled, Cashfree account/keys still needed). Free is extensive; page must not imply GATE basics require payment.

**Keep:** Keep Free/Plus/Pro and the exact supplied prices, no-renewal policy, proration, coupons and receipts.  
**Change:** Change the plan page to Free-first clarity and honest provider readiness; do not enable checkout before owner setup and tests.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Plans                        │
│ Core GATE practice stays free│
│ FREE · Rs 0                  │
│ PYQs · exam · mocks · review │
│ PLUS · Rs 29/month / 249/year│
│ PRO · Rs 99/month / 799/year │
│ No automatic renewal         │
└──────────────────────────────┘
```

DESKTOP:
```text
┌──────────────┬────────────────────────────────────────────────────────────┐
│ NAV          │ Plans · Core GATE preparation remains on Free              │
│              ├────────────────┬────────────────┬─────────────────────────┤
│              │ FREE           │ PLUS           │ PRO                     │
│              │ Rs 0           │ 29/mo 249/yr    │ 99/mo 799/yr            │
│              ├────────────────┴────────────────┴─────────────────────────┤
│              │ Detailed comparison / no renewal / payment notes           │
└──────────────┴────────────────────────────────────────────────────────────┘
```

**(c) Signature:** Free-first comparison, with exact incremental limits; never shame or grey-out Free.

**(d) Components/states:** `PlanHeader`, `PlanComparison`, `BillingPeriodToggle`, `SeasonPassSection` (configured price only), `PaymentTrustNotes`, `CheckoutState`. States: provider disabled, already subscribed, upgrade proration, invalid coupon, cancelled/failed/pending/success, receipt unavailable.

**(e) Tokens:** Light canvas `#F7F7FB`, Free white, Plus `#EAF3FC`, Pro `#EFEEFC`, text `#20243A`, border `#E1E5EF`, CTA `#625FC3`. Dark canvas `#11151E`, Free `#191F2B`, Plus `#233344`, Pro `#302F4A`, text `#F1F3F8`, border `#354154`, CTA `#AAA6F3`. Price 28/34 Sora tabular.

**(f) Motion:** price switch direct/short; feature expansion 150ms; checkout enters pending and blocks duplicate.

**(g) Copy:** “Core GATE practice stays free.”; “Plus”; “Pro”; exact prices from source; “No automatic renewal.”; “Payments are being set up. You can keep using the Free plan.”; “Compare features”. “Free forever” only while policy remains confirmed.

**(h) Accessibility:** Mobile comparison as labelled plan sections, not unmanageable wide table; price+period read together; no colour-only distinction; announce payment status.

**(i) Avoid AI slop:** No fake was-prices, countdowns, unsupported savings percentages or “most popular” without evidence.

**(j) Skills:** `interface-design`, `ux-writing`, `product-management:write-spec`, `accessibility-audit`, `design-critique`.

**(k) Owner confirmation:** Cashfree setup/live state; Season Pass prices/expiry; exact entitlements from backend; allowed payment methods.

## 3.15 Navbar and phone dock

**Goal:** Make primary product areas discoverable and keep tools/account controls secondary.

**(a) Problems/evidence:** Desktop island contains many destinations and tools; phone dock has Home/Test Centre/Review/AI Mentor/More. Too many utilities compete; duplicated links may confuse.

**Keep:** Keep the existing desktop floating navbar island and phone dock destinations/tools.  
**Change:** Change visibility and grouping to reduce duplication; preserve permission rules and hide the main shell inside focused exam/Battles modes.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ Page content                 │
│                              │
├──────────────────────────────┤
│ Home Test Review Mentor More │
└──────────────────────────────┘
More: Battles · Analytics · Planner · Profile · Tools · Theme
```

DESKTOP:
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ [R] Dashboard Test Centre Study AI Mentor Battles Review Analytics         │
│                                    Search Calendar Focus Theme Paper Avatar │
└────────────────────────────────────────────────────────────────────────────┘
```

**(c) Signature:** One consistent floating island: primary destinations left, context/account tools right.

**(d) Components/states:** `DesktopNavIsland`, `PhoneDock`, `MoreSheet`, `ToolMenu`, `SearchOverlay`, calendar, todo, focus target, theme, paper chip, avatar menu. States: current route, hover, focus, menu open, exam/Battles hide, keyboard open, safe area, Interview permission.

**(e) Tokens:** Light shell `#FFFFFF`, border `#E2E5EF`, active `#4F4A95`, inactive `#626A80`, shadow `0 8px 28px rgba(34,40,65,.10)`. Dark shell `#1A202B`, border `#354154`, active `#C0BCFF`, inactive `#AAB5C7`, shadow `0 10px 32px rgba(0,0,0,.28)`. Labels 12/16 Manrope.

**(f) Motion:** active indicator 150ms; More sheet 180ms; reduced motion instant; theme reveal only if performant.

**(g) Copy:** “Dashboard”; “Test centre”; “Study”; “AI Mentor”; “Battles”; “Review”; “Analytics”; “More”; “Search”; “Focus target”; “Switch to light mode”; “Switch to dark mode”; “Profile”.

**(h) Accessibility:** labelled navigation landmarks; `aria-current`; More sheet focus management and return; no hover-only mobile labels; dock safe-area padding; never cover bottom content.

**(i) Avoid AI slop:** Do not add icon-plus-pill for every utility. Text for primary destinations; icons only where recognisable.

**(j) Skills:** `interface-design`, `design-elevation`, `interaction-design`, `accessibility-review`, `design-critique`.

**(k) Owner confirmation:** always-visible tools; whether Battles hides main shell; Interview visibility rules.

## 3.16 Onboarding

**Goal:** Move a new visitor to a first completed test with minimal friction.

**(a) Problems/evidence:** Supplied context reports about 1,200 visitors in the 30 days to 6 Nov 2026, about 7% start a test and zero paying customers except owner test payments. These are owner-reported baseline figures, not independently verified. Low first-test start suggests investigating landing-to-action before adding features. Avoid long mandatory setup.

**Keep:** Keep the existing six-paper selection, sign-in and current account/profile data.  
**Change:** Change the first-run path to paper → first useful action, delaying optional profile details until after initial value.

**(b) Layouts**

MOBILE:
```text
┌──────────────────────────────┐
│ RENYXERA                     │
│ A new ERA of intelligent     │
│ learning                     │
│ Prepare with official GATE   │
│ questions and AI Mentor.     │
│ Choose your paper            │
│ [CS] [EC] [EE] [ME] [CE] [DA]│
│ Choose where to begin        │
│ [Attempt a PYQ]              │
│ [Short practice test]*       │
│ [Continue]                   │
│ Already have an account?     │
└──────────────────────────────┘
```

DESKTOP:
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ RENYXERA                                                                    │
│ Prepare for GATE with a clear next step     Choose paper: CS EC EE ME CE DA │
│ Official questions · exam simulator        Choose: [Attempt a PYQ]         │
│ Mentor · revision · analytics              [Short practice test]* [Continue]│
└────────────────────────────────────────────────────────────────────────────┘
*Only show if that route exists for the selected paper.
```

Mobile uses one focused path; desktop can show product proof and paper selection in broad zones. Do not require goals/college/study hours before first question.

**(c) Signature:** Paper → first action, leading directly to a real sample/test route.

**(d) Components/states:** `OnboardingWelcome`, `PaperPicker`, `FirstActionPicker`, `AccountContinue`, optional `GoalSetup`, `OnboardingProgress`. States: returning user, paper unknown, saved profile, interrupted registration, offline, invalid paper.

**(e) Tokens:** Light canvas `#F7F7FB`, surface `#FFFFFF`, text `#20243A`, secondary `#626A80`, brand `#625FC3`, selected `#EFEEFC`, border `#E1E5EF`. Dark canvas `#11151E`, surface `#191F2B`, text `#F1F3F8`, secondary `#AAB5C7`, selected `#302F4A`, border `#354154`, brand `#AAA6F3`. Title 30/38 Sora; body 15/23 Manrope.

**(f) Motion:** paper selected 120ms; next step crossfade 160ms; no autoplay/parallax; reduced motion immediate.

**(g) Copy:** “Choose your GATE paper”; “Choose where to begin”; “Attempt an official PYQ”; “Take a short practice test” only if accurate; “Continue”; “Already have an account? Sign in”; “You can add your study goal later.”; “We could not save your selection. Try again.”

**(h) Accessibility:** labelled paper group; selected state not colour-only; retain selection on error; no timed step; skip optional profile details.

**(i) Avoid AI slop:** No generic hero blob, stock student, fake testimonial, fake user count or five-slide carousel. Show genuine product task and actual six papers.

**(j) Skills:** `ux-research`, `journey-mapping`, `ux-strategy`, `interface-design`, `frontend-design`, `ux-writing`, `accessibility-audit`, `metrics-review`.

**(k) Owner confirmation:** sample before account; best first action; availability/question count by paper; collect goal now or later.

---

# 4. Visual system — refined light and separate dark direction

The owner likes pastel light mode, dislikes repeated card templates and says current dark mode is poor. The following is a proposal, not a claim that tokens are live.

## 4.1 Concept: “Marked paper, measured progress”

Build from answer sheets, margin marks, equation paper, calculator keys, circuit notation, rank tables and annotated diagrams. RENYXERA should look like a carefully designed learning instrument, not a generic productivity dashboard. Use one signature visual per screen: Dashboard—next action; Test Centre—activity selector; Builder—source matrix; Exam—question workspace; Results—marks ledger; Review—mistake record; Flashcards—retrieval card; Mentor—structured explanation; Analytics—evidence-backed action; Reader—worked example; Battles—Arena identity/VS; Profile—identity header; Plans—Free-first comparison; Navigation—island/dock; Onboarding—paper-to-first-action.

## 4.2 Light palette

| Token | Hex | Use |
|---|---|---|
| canvas | `#F7F7FB` | App background |
| surface | `#FFFFFF` | Main work surface |
| surface-quiet | `#F1F2F8` | Secondary region |
| text-primary | `#20243A` | Main text |
| text-secondary | `#626A80` | Supporting text |
| text-muted | `#81889A` | Metadata; verify contrast |
| border | `#E1E5EF` | Dividers |
| brand-violet | `#625FC3` | Main action/selected |
| brand-blue | `#4D83B8` | Secondary action/link |
| mint surface/ink | `#EAF5EF` / `#28634F` | Positive grouping |
| sky surface/ink | `#EAF3FC` / `#315E83` | Informational grouping |
| peach surface/ink | `#FFF0E9` / `#8B4F3B` | Warm emphasis |
| rose surface/ink | `#FAEDF1` / `#883F57` | Error/wrong |
| butter surface/ink | `#FBF3DF` / `#725B24` | Caution/pending |
| peri surface/ink | `#EFEEFC` / `#4F4A95` | Selected/focus |
| lilac surface/ink | `#F4EDFB` / `#644B83` | Secondary grouping |

Pastel fills are grouping accents, not default containers. Main reading areas can remain white with typography and dividers.

## 4.3 Dark direction: “Quiet graphite, lifted surfaces”

| Token | Hex | Use |
|---|---|---|
| canvas | `#11151E` | Blue-neutral page background |
| surface-1 | `#191F2B` | Primary panel |
| surface-2 | `#222B3A` | Raised panel/control |
| surface-3 | `#293447` | Dialog/popover/active surface |
| surface-inset | `#141A24` | Input/code |
| border | `#354154` | Standard boundary |
| border-strong | `#4A5870` | Focus/selected |
| text-primary | `#F1F3F8` | Main text |
| text-secondary | `#AAB5C7` | Secondary text |
| text-muted | `#8793A8` | Metadata; verify contrast |
| brand | `#AAA6F3` | Main accent |
| blue | `#8DB9F0` | Secondary accent |
| mint surface/ink | `#20352F` / `#A5D7C2` | Positive |
| rose surface/ink | `#3B2730` / `#E6A6B1` | Wrong/error |
| butter surface/ink | `#3A3322` / `#E4CA8A` | Pending/caution |
| sky surface/ink | `#233344` / `#AFCBE6` | Information |
| periwinkle surface/ink | `#302F4A` / `#C0BCFF` | Selected |

### Elevation steps

1. Canvas `#11151E`, no shadow.
2. Surface 1 `#191F2B`, 1px boundary `#283244`.
3. Surface 2 `#222B3A`, 1px boundary `#354154`.
4. Surface 3 `#293447`, 1px boundary `#4A5870`.
5. Modal `#293447`, shadow `0 18px 48px rgba(0,0,0,.40)` plus backdrop.

Elevation comes from luminance step, boundary and selective shadow, not glow on every component.

### Dark-mode rules

- No pure black everywhere; no saturated full-surface violet/blue/red/green.
- No coloured top stripe on every panel; use surfaces and direct labels.
- Brightest accent belongs to current interaction.
- Small consistent chart palette.
- Review MathJax, code, question images, selection, disabled and hover states separately.
- Test each foreground/background contrast pairing; appearance alone does not prove accessibility.

## 4.4 Typography

| Token | Size/line | Font | Use |
|---|---|---|---|
| Display 1 | 36/44 | Sora bold | Rare hero/result |
| Display 2 | 30/38 | Sora semibold | Page title |
| Heading 1 | 24/32 | Sora semibold | Main section |
| Heading 2 | 20/28 | Sora semibold | Subsection |
| Heading 3 | 17/24 | Sora semibold | Row title |
| Body large | 16/26 | Manrope | Reading/question |
| Body | 14/22 | Manrope | UI text |
| Body small | 13/19 | Manrope | Supporting |
| Label | 12/16 | Manrope medium | Metadata |
| Numeric | contextual | Sora tabular | Scores/timers |
| Wordmark | existing | Bruno Ace SC | Brand only |

Do not use Bruno Ace SC for UI labels.

## 4.5 Radius and spacing

- `radius-xs` 6px (small controls), `radius-sm` 10px (buttons/inputs), `radius-md` 14px (common surface), `radius-lg` 18px (panel), `radius-xl` 24px (major overlay), pill 999px only for meaningful pills.
- 4px base spacing unit.
- 44px minimum target for frequent controls (internal target); 44×44px icon button target.
- Inner controls should have smaller radii than outer containers. Do not round every nested element equally.

## 4.6 Iconography and illustration

Use a consistent line-icon family (Lucide style if already installed), not emoji as primary navigation icons. Prefer subject-derived motifs: logic gates, graphs, signal plots, matrices, circuit annotations, calculator keys, OMR marks and answer-sheet margin marks. Icons explain function; diagrams must not look like official question figures unless they are authentic source figures.

## 4.7 QA gate

Capture every screen in phone light/dark and desktop light/dark. Check default, hover, focus, selected, disabled, loading, empty and error. Include MathJax, images, code, charts, popovers, dialogs and keyboard open. WCAG 2.2 AA is the baseline [R2]; 44px hit targets are a stronger internal target [R3].

---

# 5. Motion and effects

Motion must answer an action. Use `motion/react` already in stack, prefer transform/opacity, avoid layout-heavy animation and long-running effects on low-end phones.

## 5.1 Motion tokens

| Token | Duration | Easing | Use |
|---|---:|---|---|
| instant | 0ms | none | Reduced motion/state |
| micro | 100ms | ease-out | Button/option |
| fast | 150ms | ease-out | Tab/menu/tooltip |
| standard | 180–220ms | `cubic-bezier(.2,.8,.2,1)` | Panel/dialog |
| emphasis | 260–320ms | `cubic-bezier(.16,1,.3,1)` | One reveal/result |
| orchestrated | 450–650ms | restrained spring | Battles intro/theme reveal |

Allow one orchestrated moment per screen; keep the rest quiet.

## 5.2 Motion inventory

1. Page entry 160–200ms opacity, no large translate.
2. Nav selection 140–160ms indicator movement.
3. Button press 100ms scale to 0.985 and restore.
4. Dropdown/sheet 160–180ms opacity/translate, no bounce.
5. List insertion 120ms fade for a few rows, not a cascade of dozens.
6. Chart reveal 250ms once; final state clear with motion off.
7. Saved confirmation 120ms icon/state and persistent text.
8. Theme reveal optional 350–450ms; immediate under reduced motion.
9. Result highlight 250ms once; no fake score count.
10. Battles match-found 350–500ms; no heavy 3D.
11. Rewards 250–320ms once; no random reward wheel.
12. Loading skeleton static or restrained shimmer; never bright infinite shimmer.

## 5.3 Sound and haptics

Sound defaults off/muted. Separate SFX/music only if both exist. Vibration API is optional and brief, never the sole feedback. No exam sound unless user enables it. Use original Web Audio synthesis or clearly licensed assets; do not copy game audio.

## 5.4 Reduced motion

Use `@media (prefers-reduced-motion: reduce)` and an in-app preference where useful. Replace spatial movement with instant state or subtle opacity; remove parallax, zoom, loops, pulsing rings and particles. Keep selected/saved/error feedback visible. Allow users to stop non-essential persistent motion [R4].

## 5.5 Performance budget

Animate transform/opacity; avoid large canvas/video backgrounds and unbounded blur; lazy-load below-fold visuals; reserve chart/image dimensions; keep layout shift low. Google’s “good” Core Web Vitals targets are LCP ≤2.5s, INP <200ms and CLS <0.1 at the 75th percentile [R5]. These are field targets, not guarantees.

---

# 6. Copy — 20 key interface strings

These are proposed replacements; compare with actual current strings before implementation.

| # | Context | Recommended copy |
|---|---|---|
| 1 | Dashboard action | “Review the questions you missed in your last test.” |
| 2 | No study plan | “You have not added a task for today.” |
| 3 | Insufficient readiness | “Complete a few more questions to build this estimate.” |
| 4 | Test Centre | “Build a test” |
| 5 | No matching questions | “No questions match this paper and topic.” |
| 6 | Forge restriction | “Forge questions are not available in built tests yet.” |
| 7 | Spark provenance | “AI-generated practice question” |
| 8 | Local storage | “Saved on this device. It may not appear on another device.” |
| 9 | Exam saved | “Answer saved” |
| 10 | Save failure | “Your answer could not be saved. Check your connection and try again.” |
| 11 | Submit confirmation | “Submit this test? You will not be able to change your answers afterwards.” |
| 12 | Result follow-up | “Review your [actual count] incorrect answers.” |
| 13 | Missing solution | “A worked solution is not available for this question yet.” |
| 14 | Mentor quota | “You have reached today’s request limit. Your draft is still here.” |
| 15 | Mentor outage | “The Mentor is temporarily unavailable. You can review saved solutions while you wait.” |
| 16 | Analytics sample | “Not enough attempts to show a reliable topic trend.” |
| 17 | Plan trust | “No automatic renewal.” |
| 18 | Payment incomplete | “Payments are being set up. You can keep using the Free plan.” |
| 19 | Empty matchmaking | “No opponent is available right now. Challenge a friend or return to study.” |
| 20 | Exit Battles | “Exit to study” |

### Copy rules

Avoid “Unlock your potential”, “Crush GATE”, “Dominate”, “Level up your learning”, “AI-powered excellence”. Do not say “official solution” unless provenance supports it. Do not say “real-time” for a five-second update. Do not say “rank” when showing Elo or season points unless it is a rank position. Always show IST for scheduled times. Avoid fake urgency, fake former prices and fabricated social proof.

---

# 7. Monetisation and upgrade moments

## 7.1 Principles

1. Free remains genuinely useful for GATE preparation.
2. Show paid prompts after value is understood or a real allowance is reached.
3. Never interrupt a live exam answer or delete a draft to show an upgrade.
4. Show exact limits/reset before starting a limited action.
5. No auto-renew, free trial, lifetime plan, paid coins or pay-to-win.
6. Use existing approved prices/entitlements only.

## 7.2 Plan truth table

| Plan | Supplied price | Stated value |
|---|---|---|
| Free | Rs 0, forever | Official past papers for branch, exam simulator/custom tests, All-India mocks/ranks, analytics, mistakes/revision, cloud sync, Telegram reminders, 10 Forge questions, small AI Mentor taster |
| Plus | Rs 29/month or Rs 249/year | Forge 15/day with worked solutions; Mentor 75 requests/day; Spark 5 sets/day; other entitlements must be checked in backend |
| Pro | Rs 99/month or Rs 799/year | Forge unlimited including X/archive; Mentor 150 requests/day; Spark unlimited; premium analytics; Pro Design Studio Looks |
| Season pass | Date-priced | Read configured live price/access rules; not supplied here |

Do not invent missing Plus/Pro entitlements. Read current backend entitlement map before changing plan cards.

## 7.3 Contextual upgrade moments

| Place | Trigger | Honest message approach | Avoid |
|---|---|---|---|
| Forge | Free user uses 10-question taster | Explain Plus 15/day with solutions and Pro unlimited/X/archive | Blocking PYQs or mocks |
| Mentor | 5 daily requests used | Show exact alternative routes and allowances | Interrupting draft |
| Spark | Plus reaches 5 sets/day | Explain relevant limit and plan only if user asks for more | Calling Spark official PYQ |
| Analytics | Pro analytics clicked | Preview actual report and its measures | Hiding free analytics |
| Design Studio | Pro Look previewed | Show preview and plan requirement | Locking basic accessibility/usability |
| Materials | Deadlock sample ends or locked pack opened | Show lesson content and approved one-time price | Pretending pending pack is live |
| Plans | User opens page or genuine feature limit reached | Free-first comparison and no-renewal | Repeated popups/false scarcity |

## 7.4 Pricing presentation

Show monthly and annual prices unambiguously. No crossed-out prices or savings percentages unless calculated and approved. Explain no auto-renew beside checkout. Show access start/end. Explain Plus→Pro proration only with actual payment calculation. Provide receipt/history where backend supports it.

## 7.5 Payment readiness checklist

Source says Razorpay disabled, provider layer supports Cashfree, owner still needs account and keys. Before live checkout:

1. Owner completes provider signup/KYC and key creation.
2. Keep secrets only in Worker secrets, never client bundle.
3. Test successful, failed, cancelled, duplicate and delayed webhook paths in sandbox.
4. Verify webhook signatures and idempotent reconciliation.
5. Verify receipts, error refunds, access windows and prorated upgrade.
6. Test return to app on phone PWA and desktop.
7. Give owner exact manual secret/deployment steps.
8. Switch production checkout on only after verification.

## 7.6 Trust signals

Use “No automatic renewal”, “Core GATE practice remains available on Free”, current verified PYQ coverage, server grading only for test types where true, and “No paid coins/no real-money stakes” for Battles. Do not claim “trusted by thousands”, “best GATE app”, “guaranteed rank”, AI accuracy or student outcomes without evidence.

---

# 8. Marketing and growth — 30-day Rs 0 plan

## 8.1 Starting point and constraints

Supplied context reports ~1,200 visitors in the 30 days to 6 Nov 2026, ~7% start a test, and zero paying customers except owner's test payments. Treat as owner-reported baseline; validate analytics. Main early objective is improve first-test journey, not simply impressions.

Available: Telegram hub + six branch channels; Instagram publisher built but account setup pending; YouTube channel exists but no video; WhatsApp shares; SEO; college communities; referrals; Battles invites. No scraping, no unsolicited bulk messages; opt-in only; UTM every link; never invent counts/results. Ad video is ON HOLD.

## 8.2 Funnel

`Post/search impression → tagged landing visit → paper selection → sign in/continue → first test start → first test completion → result review → 7-day return → optional paid conversion`

Measure visits by UTM, paper selection, first test start/completion, result review, D1/D7 return, referral starts/completion and paid funnel once checkout is live.

## 8.3 Content pillars

1. One GATE question, one useful explanation (why correct, common trap).
2. Negative marking clarity without anxiety exaggeration.
3. Study alone, but with feedback (Mentor/Mistakes/revision workflow).
4. Official PYQ practice with source/year.
5. Real product walkthrough from start to finish.
6. Branch relevance using actual CS/EC/EE/ME/CE/DA bank content.

## 8.4 30-day calendar

Schedule is a proposal; do not assume Instagram connected or YouTube automation ready. Complete setup first.

| Day | Action | Channel | CTA/asset | Measure |
|---:|---|---|---|---|
| 1 | Audit visit→test events and UTM naming | Internal | Funnel definition | Event coverage |
| 2 | Finish Instagram setup/profile | Instagram | Accurate bio/live URL | Setup |
| 3 | Prepare branch PYQ template | Telegram | Question + reveal + explanation | Tagged clicks |
| 4 | CS PYQ with reasoning | Telegram/Instagram | Try question | Test starts |
| 5 | Record 20–30s simulator capture | Instagram Reels | Start free test | Landing→start |
| 6 | Negative-marking explainer | Telegram/Instagram | MCQ scoring | Saves/clicks |
| 7 | Review funnel and fix largest drop | Internal | One UX fix | Conversion delta |
| 8 | EC PYQ and explanation | Telegram | EC paper | Tagged visits |
| 9 | Reuse capture as YouTube Short | YouTube | Feature demo | Views→visits |
| 10 | Mistake review walkthrough | Instagram/YouTube | Review route | Review use |
| 11 | Mentor question explanation | Telegram | Mentor route | Mentor starts |
| 12 | Verified ME or CE PYQ | Telegram | Branch link | Visits |
| 13 | Free vs Plus explainer | Instagram | Plans | Plans views |
| 14 | Weekly review of hooks/timing | Internal | Keep/change formats | Test-start rate |
| 15 | What happens after submission | Instagram | Result demo | Completion |
| 16 | DA PYQ with source/year | Telegram | DA page | Tagged visits |
| 17 | Solution/trap comparison | Instagram Reel | Try question | Saves/shares |
| 18 | Mock reminder only if schedule confirmed | Telegram | Mock page | Mock starts |
| 19 | No-voice simulator walkthrough | YouTube Shorts | First test | Retention/clicks |
| 20 | Opt-in feedback request | In-app/opt-in | Report confusing step | Feedback count |
| 21 | Compare starters vs non-starters | Internal | Funnel report | Drop-off |
| 22 | Study-plan tool demo | Instagram/Telegram | Plan tool | Tool use |
| 23 | CS Forge sample with current count/limits | Telegram/Instagram | Forge page | Forge engagement |
| 24 | Publish a correction/clarification from feedback | Relevant channel | Transparent update | Follow-up |
| 25 | Past-paper archive walkthrough | YouTube Short | Paper page | Paper starts |
| 26 | Explain result/challenge share card | Opt-in WhatsApp/Instagram | Share feature | Shares/referrals |
| 27 | One mistake, one revision action | Telegram | Review module | Revision starts |
| 28 | Weekly funnel review / one fix | Internal | UX change | Conversion delta |
| 29 | Reuse best educational format in two branches | Telegram | Branch content | Tagged starts |
| 30 | Keep/change/stop review | Internal | Next plan | Cohort metrics |

Do not send unsolicited WhatsApp broadcasts. Use user-initiated shares, opt-in groups and share cards.

## 8.5 Ten content ideas

1. Real 1-mark MCQ: correct/wrong/unattempted marks.
2. MSQ all-or-nothing trap.
3. NAT tolerance with genuine question.
4. What the exam question palette does.
5. Where did marks go? (clearly labelled demo or consented result).
6. Turn wrong answer into revision item.
7. Mentor explanation labelled AI where relevant.
8. Build Section Sprint/Topic Spotlight.
9. Branch-specific official PYQ with verified year/source.
10. Transparent Free plan walkthrough.

## 8.6 Channel guidance

**Telegram:** Maintain hub/six branches; one question/day only if reliable; question, topic, paper, source/year; later answer reveal; unique UTM per channel/post.

**Instagram:** Complete setup; use original screen recordings and educational examples; readable captions; pin walkthrough, Free plan and current GATE question; no unverified results.

**YouTube Shorts:** Original 15–40s clips, captions, one question/task, tagged relevant page. Long-form walkthrough after Shorts reveal demand.

**WhatsApp:** User-initiated share cards; factual copy; no marks/username/private profile unless consented.

**SEO:** Strengthen branch PYQ, individual verified question, syllabus/topic, score calculator and plan-tool pages. Accurate title/metadata, canonical URLs and structured data only where valid. Review dated exam pages.

**College/referrals:** Use college picker to identify community categories, not scrape contacts. Follow community rules and ask permission. Existing referral: both users get 7 Pro days after referred friend completes first test; explain condition and award once server-side.

## 8.7 Growth experiments

One experiment at a time: landing first-action clarity; paper selection order; authentic sample PYQ entry; result next action; Telegram question-first vs explanation-first. Record dates, sample size and actual metric. With small samples, call results directional, not statistically conclusive.

---

# 9. Expansion roadmap — after GATE 2027 results and first revenue

## 9.1 Before GATE 2027

1. Fix first-test funnel and test completion reliability.
2. Finish payment provider setup and test customer journey.
3. Finish Forge/Blend capability truth and server grading path.
4. Ship full-screen Battles only after reusable live match path is audited.
5. Complete dark mode and accessibility QA.
6. Address pending privacy/DPDP consent, owner-account 2FA, CSP, shared rate limits and Sentry alerts.
7. Keep content current for the 6–21 February 2027 GATE window stated in the supplied context; verify official announcements before publishing date-sensitive claims.

## 9.2 March 2027 data refresh

Supplied context says March is when official data is refreshed and results are usually mid-March. Do not assume exact result publication date without official confirmation.

1. Refresh answer keys, marks-to-rank and cut-offs only after verifying official sources.
2. Record source, publication date, paper and version for every dataset.
3. Recompute readiness calibration with approved data; preserve old calculation version for historical comparison.
4. Update score/cut-off tools and state data year.
5. Review question bank coverage/corrections from 2027.
6. Publish “data updated” with actual date and scope.
7. Collect post-exam feedback on most-used modules and failure points.

## 9.3 After first revenue

1. Custom domain and branded email.
2. Store packaging if usage justifies distribution/maintenance cost.
3. Expand Forge to EC, EE, ME, CE, DA in verified stages.
4. Study Materials packs after Phase 0 quality, storage protection, checkout and refund rules are ready.
5. Hindi only with translation/technical terminology review capacity.
6. ESE/PSU/interview exam expansion only after GATE needs and content-quality operations are served.

No revenue threshold is proposed because none was supplied. Decide against cash flow, support load, conversion and retention.

---

# 10. Risks and prevention

| Risk | Trust impact | Prevention / release gate |
|---|---|---|
| Incorrect question/answer/solution | GATE prep depends on accuracy | Preserve source/version/verification/correction; server grading; report path |
| Forge/Spark mistaken for PYQ | Provenance confusion | Persistent labels in builder, exam, result, flashcard |
| Readiness overclaims precision | Bad study decisions | Sample size, last update and limits beside estimate |
| Mentor hallucination | Incorrect learning | Separate AI explanation from verified answer; link to source; report issue |
| Broken payment flow | Direct trust damage | No live checkout before provider/webhook/receipt tests |
| Plan/quota ambiguity | Feels deceptive | Exact allowance before use; enforce same backend limits |
| Dark contrast failures | Reading fatigue/accessibility | Test each pairing in light/dark |
| Motion discomfort | Vestibular/distraction issue | Reduced-motion, no continuous decoration, pause/disable where needed [R4] |
| Small touch targets | Mis-taps on phone | 44px design target; WCAG AA minimum checks [R2][R3] |
| Navigation overload | Cannot find next task | Primary hierarchy and contextual More sheet |
| Empty matchmaking | Feels fake/broken | Honest no-opponent state; friend/practice fallback; no fake users |
| Battles distract from study | Undermines study product | Optional short formats, quiet hours, no forced streak anxiety, Exit to study |
| Coin farming | Economy/rank integrity | Server caps, idempotent ledger, repeat-opponent detection; no coin purchase |
| Privacy/share leak | Marks/identity exposed | Consent, data minimisation, DPDP review, RLS and account controls |
| Free AI quota exhaustion | Feature reliability | Cache, fallback, clear state, budgets and monitoring |
| One-person bottleneck | Quality drops | Narrow scope, reuse modules, order by risk/conversion |
| AI-looking UI | Owner rejects product | One signature element/screen, screenshot critique, varied hierarchy |
| Abandoned content cadence | Credibility loss | Publish only what can be maintained and verified |
| Stale exam facts | Students rely on old info | Source/review date; official refresh process |

### Trust release checklist

- Official/original/AI content clearly labelled.
- Scores server-graded; keys absent from client before reveal.
- Payment live only after provider setup.
- Price and entitlements match backend.
- Renewal copy matches actual policy.
- Dates/time display IST.
- Share card profile fields consent-based.
- Public/private profile fields separated.
- RLS and service-role boundaries tested.
- Keyboard, screen-reader, contrast and reduced-motion tests.
- Phone/desktop and light/dark screenshots reviewed.

---

# 11. Needs owner confirmation — decision register

| ID | Decision | Recommended default | Why approval is needed |
|---|---|---|---|
| D01 | Dashboard next-action authority | One real-data recommendation with evidence | Changes entry hierarchy |
| D02 | Sample PYQ before account | Only if auth/data model safely supports | Changes acquisition/auth |
| D03 | Readiness formula/sample | Keep current formula, disclose sample | High-trust estimate |
| D04 | Forge grading in built tests | Build after exam-engine support | Cross-cutting server change |
| D05 | Blend presets/source mix | Scope-aware based on inventory | Prevents false combinations |
| D06 | Dark palette/elevations | Prototype section 4 | Current dark UI rejected |
| D07 | Battles V1 scope | Full-screen shell + existing live paths; defer new queue if unready | Two-week capacity |
| D08 | Ranked matchmaking | Only after queue/fairness/no-opponent states | Empty population risk |
| D09 | Ranked match duration | Decide after real question-mix testing; 10/10 was prior proposal | Fairness/pacing |
| D10 | Quick Clash | 5 questions × 60 seconds as an idea | Not approved/live |
| D11 | Practice bots | Non-ranked, explicitly labelled, only if justified | Owner has not decided |
| D12 | Arena tiers | Engineering names as proposal | New public progression |
| D13 | Elo season reset | Preserve current rating until policy agreed | Reset not supplied |
| D14 | XP/levels/missions/badges/season track | Defer until current economy stable | New systems/data |
| D15 | Coin cap/repeat opponent rules | Do not change without abuse evidence | Alters live economy |
| D16 | Club chat | Emotes-only before free-form chat | Moderation burden |
| D17 | Spectating/Club Wars | Defer beyond V1 | Realtime/integrity complexity |
| D18 | Share defaults | Consent-based; no private data by default | Privacy |
| D19 | Study Materials content/price | Rs 99–149 range only after final pack spec | Product pending |
| D20 | Payment provider | Cashfree recommended, owner setup required | External account/KYC/keys |
| D21 | Exact plan entitlements | Read backend; do not invent | Copy must match enforcement |
| D22 | Quota reset time | Show only after backend confirmation | Prevent misleading copy |
| D23 | Dark style names | Compare Edge/Midnight/Tinted prototypes | Current dissatisfaction |
| D24 | Navigation tools | Keep frequent tools visible | Global navigation change |
| D25 | Instagram/YouTube setup | Finish setup before cadence commitment | Account access |
| D26 | Ad video | Keep ON HOLD until owner approves | Explicit pause |
| D27 | GATE official data source | Verify official data every refresh | Exam accuracy |
| D28 | Domain/stores | Defer until revenue | Budget/maintenance |

---

# 12. Delivery plan for Claude Code and the owner

## Phase 0 — inspect before changing

Claude Code should:

1. Read README, architecture notes and package scripts.
2. Map App Router routes to section 3 screens.
3. Find design tokens, theme provider, nav/dock and layout boundaries.
4. Map Test Centre source capability and server grading handlers.
5. Map Mentor quota enforcement, model calls, caching and fallback.
6. Map payment provider state and secret management.
7. Map Battles data model, Realtime usage (source context says Realtime is available but not yet used globally), match state and reward transactions.
8. Identify existing analytics event definitions.
9. Identify accessibility/performance test tooling.
10. Produce an audit table: found / partial / missing / risky, with file paths and evidence.

Do not change files during this audit unless the owner explicitly asks for an immediate fix.

## Phase 1 — highest-value fixes

1. Instrument and validate landing-to-first-test funnel.
2. Fix source labels and unsupported-builder states.
3. Add results next action and readiness sample context.
4. Improve high-priority empty/error/loading states.
5. Finish payment provider setup and trust checks.
6. Prioritise privacy/security items in section 10.

## Phase 2 — shared design system

1. Prototype light/dark on Dashboard, Exam, Results and Analytics.
2. Capture phone and desktop screenshots.
3. Run `design-skills:design-critique` and `unslop`.
4. Validate contrast, focus, targets and reduced motion.
5. Only then migrate shared components/tokens.

## Phase 3 — Battles

1. Build route/layout boundary and exit path.
2. Reuse existing friends/challenges and question renderer.
3. Reuse trusted scoring and reward transactions.
4. Integrate existing Arena rating/points/leaderboard.
5. Complete reconnect/empty/no-opponent/error states.
6. Add proposed progression only after explicit approval.

## Phase 4 — broader product

1. Finish Forge grading in exam tests.
2. Redesign Blend source availability.
3. Complete Study Materials Phase 0.
4. Expand content only with verification capacity.
5. Run monthly funnel, retention and content-quality reviews.

### Required Claude Code handoff for every task

- **What changed:** files and user-visible behaviour.
- **Why:** user problem and source/evidence requirement.
- **What remains:** known limitations/states not implemented.
- **Owner actions:** migration, manual secret/account/provider steps or review.
- **Verification:** commands, tests, screenshots (phone/desktop, light/dark), keyboard/screen-reader checks.
- **Risk:** data migration, route, plan, billing, RLS or grading implications.

Never ask the owner to run unexplained SQL or paste a secret into source. Provide exact migration file, safe manual steps and rollback notes.

---

# 13. Research references

These support interaction, accessibility, motion and performance recommendations. They do **not** prove RENYXERA-specific user problems; validate those with product data and usability research.

**[R1] Nielsen Norman Group — 10 Usability Heuristics for User Interface Design.** Informs system status, real-world language, user control, consistency, error prevention, recognition, efficiency and minimalist hierarchy. Reviewed 30 January 2024 as shown on source page.  
https://www.nngroup.com/articles/ten-usability-heuristics/

**[R2] W3C — Web Content Accessibility Guidelines (WCAG) 2.2.** Use WCAG 2.2 AA as baseline for keyboard operation, focus visibility, labels, contrast, target size and accessible interactions.  
https://www.w3.org/TR/WCAG22/

**[R3] W3C WAI — What’s New in WCAG 2.2.** Explains the 24×24 CSS px target-size minimum with defined exceptions. RENYXERA's 44px recommendation is a stronger product target for frequent touch controls, not the WCAG AA minimum.  
https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

**[R4] web.dev — Animation and motion.** Discusses whether motion is essential, `prefers-reduced-motion`, and pause/stop/hide for non-essential movement.  
https://web.dev/learn/accessibility/motion

**[R5] Google Search Central — Understanding Core Web Vitals.** “Good” field targets: LCP ≤2.5s, INP <200ms and CLS <0.1 at the 75th percentile. These are not guarantees or a replacement for real-device testing.  
https://developers.google.com/search/docs/appearance/core-web-vitals

---

# Final recommendation

The highest-leverage RENYXERA work is not to add more modules. It is to make the current value obvious and dependable:

1. Get more first-time visitors to start and complete an official question/test.
2. Make the result explain the student's marks and give one credible next step.
3. Make source and answer provenance unmistakable across PYQ, Forge and Spark.
4. Improve Mentor context and quota transparency without overpromising AI reliability.
5. Make Battles a genuinely separate game mode while reusing trusted live systems.
6. Finish payment, privacy, accessibility and performance foundations before scaling monetisation or traffic.

For every screen, the standard is: **one clear student goal, one recognisable signature element, honest data, visible system state, and a layout designed separately for phone and desktop.** If a proposed screen could be generated as a generic dashboard by any model, redesign its structure around the actual study task rather than adding another colour or gradient.
