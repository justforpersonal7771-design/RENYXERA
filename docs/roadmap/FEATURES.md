# Feature catalogue (proposals — owner approves by number)

*22 Oct 2026. Each idea: what it is · why it matters · how (main pieces) · tier · effort (S ≤ 1 session, M 2–4, L 5+) · cost. Nothing here is decided; approved items move into the relevant release file and `checklist.md`. All are ₹0 to run unless marked 🟡.*

## A. Learning and practice

1. **Mistake DNA** — every wrong answer is classified (concept gap, calculation slip, misread, time pressure, guess) from timing, option choice and a one-tap "why did I miss it?" prompt. *Why:* students fix the right problem. *How:* classifier rules in `lib/learning/`, analytics card per subject, revision playlist per type. Plus/Pro (summary free). M.
2. **Syllabus mastery heatmap** — every subtopic of the official syllabus coloured by mastery with PYQ weight as size; tap a cell to practise. *How:* syllabus JSON + attempts + mastery model; treemap on Analytics. Free (basic) / Plus (full). M.
3. **Exam-day rehearsal** — official instructions screen, 3-hour run with exact breaks rules, rough-sheet timer, post-exam "what to change" report (time per section, skipped-then-solved, panic switches). Free (PYQ) / Forge Mock version for all. M.
4. **Time coach** — your time per question vs successful students' median; flags slow 1-mark questions and rushed 2-markers. *How:* aggregate `exam_responses` timings (anonymised). Plus. M.
5. **Smart revision playlists** — 15/30/60-minute sessions mixing due mistakes, weak topics and Forge items; resumes where you stopped. Plus. S–M.
6. **Formula and concept flashcards (FSRS)** — generated from study materials and solutions; swipe UI; daily due count. Study pass / Pro. M.
7. **"Why this option is wrong"** — explanation for every distractor (Forge has it by design; PYQs via cached AI pre-generation). Plus/Pro. M.
8. **Similar-question finder** — "3 more like this" from PYQs + Forge by topic, type and difficulty. Free (PYQ) / Plus (Forge). S.
9. **Attempt comparison** — compare two attempts of the same paper (score, time, topics, changed answers). Free. S.
10. **Error notebook** — auto-generated per subject: question, your answer, correct idea, one-line lesson; exportable inside the app only. Plus. S.
11. **Calculator speed trainer** — drills on the official virtual calculator (key sequences for log, nCr, matrix-free tricks). Free. S.
12. **Normalisation simulator** — "what would my GATE score be in a tougher/easier shift" using official formula and calibration. Free (SEO tool). S.
13. **Peer benchmark per question** — "students at your target rank: 2:10, 82 % correct". Plus. M.
14. **Audio revision** — TTS of key points and formulas for commutes (browser speech synthesis, ₹0). Pro. S.
15. **Doubt from a photo** — upload a photo of a question from a book; AI Mentor explains (Gemini vision free tier, quota counted). Pro. M.
16. **Explain levels** — toggle "simple / exam / deep" on AI explanations. Plus/Pro. S.

## B. Motivation and community
17. **Streak calendar with freeze tokens** earned from mocks. Free. S.
18. **Study-with-me focus link** — shared timer room via link, presence only, no chat (no moderation cost). Free. M.
19. **Milestone cards** — 100 questions, first 50+ mock, topic mastered, 30-day streak; uses the approved share-card style. Free. S.
20. **Weekly Telegram mentor check-in** — plan review with one-tap re-plan buttons. Plus/Pro. S.
21. **Peer study groups (small, private)** — up to 6 friends, shared weekly goal and progress, no public chat. Plus. M.
22. **Parent/mentor progress link** — read-only weekly report link the student can share (consent). Free. S.

## C. Monetisation
23. **Forge Mock detailed report unlock** — Free sees score/rank; Plus sees topic analysis + time coach. S.
24. **Target pack** — bundle per rank band (plan + Forge + study materials) at a fair combined price. M.
25. **College/teacher dashboard (B2B)** — a teacher sees their batch's mock performance and weak topics; college buys seats. L.
26. **Scholarship coupons** for top Free Forge Mock performers each month (goodwill + participation). S.
27. **Exam-season gift pass** — re-open the 10 Oct decision only if wanted. S.
28. **PSU/M.Tech interview prep add-on** — after results: question bank + mock interview checklists (content-heavy). L.

## D. Marketing and growth
29. **Public weekly Forge Mock leaderboards** (opt-in names) — SEO + shareable. S.
30. **"Question of the day" embed widget** for blogs and college sites (backlinks). M.
31. **Topic ROI public page** — marks per study hour by topic from aggregated data. S.
32. **Referral leaderboard** with monthly rewards (AI credits / pass days). S.
33. **Instagram carousel generator** from PYQ explanations (approved card fonts). M.
34. **YouTube Shorts generator** — Remotion template: question → 30 s solution with voice. M.
35. **Exam-season live pages** — answer-key release tracker, response-sheet score calculator, result-day rank estimator (official data only). M.
36. **GATE calendar alerts** on Telegram hub — form dates, admit card, exam days, results (from `lib/seo/gate2027.ts`). S.
37. **PSU recruitment via GATE tracker** — official notifications list per branch (links only, cited). M.

## E. UI/UX
38. **First test in under 60 seconds** — "Start a 10-question warm-up" on first visit; branch auto-detected from landing page. S.
39. **Global search (Ctrl+K)** — questions, topics, tools, pages, settings. M.
40. **Dashboard personalisation** — reorder/hide cards; saved per account. S.
41. **Mobile exam layout v2** — bottom-sheet palette, larger tap targets, landscape mode, thumb-reach navigation. M.
42. **Per-subject offline packs** (Plus/Pro) — download banks + images for a subject. M.
43. **Dark-mode diagram tuning** — smarter inversion that keeps colours in coloured diagrams. S.
44. **Skeleton loaders everywhere; optimistic bookmarks/notes**. S.
45. **Accessibility** — screen-reader labels for maths, high-contrast theme, dyslexia-friendly font option, full keyboard exam. M.
46. **In-app "What's new"** tied to the version watch. S.
47. **One upgrade sheet** that previews exactly what a locked feature gives. S.
48. **Hindi UI (labels only)** — questions stay in English as in GATE. M.
49. **Keyboard shortcuts help sheet** (exam and app). S.
50. **Onboarding goal wizard v2** — target rank → daily hours → plan created in one flow. S.

## F. Platform and operations
51. **Admin-lite page** — Forge review queue, reported questions, coupons, mock scheduling (before R10). M.
52. **Feature-flags table** — gradual rollouts by tier/branch/user list. S.
53. **Free status page** — site, AI, payments health from `/api/health`. S.
54. **Automated weekly growth report** to the owner's Telegram. S.
55. **Content quality dashboard** — reported questions, Forge item stats, AI answer thumbs-down rate. M.
56. **Automatic yearly March refresh pipeline** — new papers → keys → tags → weights → "What changed" page, with a checklist issue opened automatically. M.
