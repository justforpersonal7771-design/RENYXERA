# Release 18 — UI refresh of the core screens (priority, before Forge)

*Owner request, 26 Oct 2026: refresh the dashboard (first), analytics, AI Mentor and other main screens; replace dull or odd cards with useful, attractive ones; a fresh, current, premium look. Order after this release: Forge (R11) → solutions for every question (R20) → study materials (R12; may start before R20).*

## Principles
- **Every card answers a question the student has** ("what do I do now?", "am I on track?", "where am I losing marks?"). Cards that only decorate are removed.
- **One visual system:** bento grid, consistent card shell (`card-glass` + spotlight on hover, 20 px radius, one shadow scale), one accent per data type, numbers in the tabular font, charts from one palette (dataviz rules), light + dark.
- **Density by importance:** the top row is actions, then progress, then insight; nothing taller than it needs (no long empty cards).
- **Motion with purpose:** entrance stagger once, counters tick on change, no idle looping animations except the live timer.
- **Performance budget:** every new card is lazy below the fold; R15 budgets apply.
- **Process:** for each screen, a contact sheet of 2–3 layout options (mobile + desktop, light + dark) → owner picks → build → verify on desktop/mobile × light/dark.

## 18A · Dashboard (first)
Current issues: hero takes the first screen; "Today" area and study timer looked different from the rest (fixed 26 Oct); Study Momentum / Performance Signals / Subject Accuracy Matrix are dense number grids; long empty cards on phones.

Proposed layout (bento):
1. **Next action card (hero, compact):** greeting + one primary button chosen by the engine (continue test / today's plan block / due revision / Daily Forge), with two secondary actions. Countdown chip.
2. **Today strip:** plan blocks with time, the daily target ("42 questions or 3 blocks today", C5), streak with freeze tokens.
3. **Progress ring trio:** syllabus covered, accuracy (7-day trend sparkline), readiness vs target rank (calibrated, labelled estimate).
4. **Where marks leak:** top 3 weak topics with marks at stake and one-tap practice.
5. **Revision due:** count + oldest mistake; start button.
6. **Mocks:** next All-India/Forge mock with countdown, last result rank delta.
7. **Subject heatmap mini:** syllabus mastery tiles (links to analytics).
8. **Battle card (R19):** live friend challenges.
9. **Upgrade moment** (Free/Plus only): one contextual card, not banners.

## 18B · Analytics
- Header KPIs (marks/mock trend, accuracy, time per question, coverage).
- Syllabus mastery heatmap (C8) with institute filter (C1).
- Topic table with sparkline, attempts, accuracy, marks at stake, "practise" action.
- Time coach (idea 4), Mistake DNA (idea 1) sections.
- Locked Pro sections as a short, fixed-height preview (done 26 Oct).

## 18C · AI Mentor
- Conversation-first layout with coach picker as chips; context panel (current weak topics, plan) collapsible; suggested prompts based on data; message actions (save to notes, make flashcard, practise similar); quota meter.

## 18D · Other screens
Practice setup (fewer steps, presets), Results (scoreboard refined, battle outcome), Review (sticky bottom bar, solution panel), Profile (save bar reliability), Mocks list, Planner, Mistakes/Bookmarks/Revision lists (priority badges, compact rows), Syllabus (item shares done; heat colours), public pages (consistency).

## 18E · Competitor-inspired additions (see `../competitors/COMPETITORS_2026-10.md`)
C1 institute filter · C5 daily target · C9 score blueprint · C10 progress report · C11 guided tour · C13 focus mode · C14 topic checklist.

## Done when
Each screen: owner-approved design, desktop/mobile × light/dark screenshots, no layout overflow, CWV budgets met, analytics events for the new actions.
