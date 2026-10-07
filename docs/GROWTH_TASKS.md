# RENYXERA — Growth task checklist

Plan: `GROWTH_MASTER_PLAN.md` · Drafts: `GROWTH_ASSETS.md`.
Owner: **C** = Claude can do it in the repo/tools · **U** = needs you (an account, a login or a human relationship).
Status: [ ] planned · [~] drafted/in progress · [x] done and verified (with evidence noted).
Order inside each phase = priority (Reach × Relevance × Conversion × Compounding × Confidence ÷ Effort).

## P0 — Readiness (this week)

- [x] **R-1 (C)** Production smoke test, 22 public pages × phone/desktop × light/dark + guest exam. *8 Oct: pass except R-2.*
- [x] **R-2 (C)** Fix hydration error on `/tools/gate-study-plan` (date-picker locale). *Fixed 8 Oct; re-run smoke after deploy.*
- [x] **R-3 (C)** "Report question" exists on public question pages, results review, mistakes and revision. *Verified in code 8 Oct.*
- [ ] **R-4 (C)** Time the guest flow: branch page → 10-question test → review. Target < 5 min, ≤ 4 taps to start.
- [x] **R-5 (C)** Truthful claims. *8 Oct: fixed DA meta (said 2021–26), plan list "every PYQ since 2017", PYQ tool blurb (said CS only), share image (said 975 PYQs → 2,470 · 5 papers). Open question for you: "All-India mocks" is still claimed in plans/terms/share image while mocks are on hold.*

## P0 — Measurement

- [ ] **G-1 (U)** Turn on Google Search Console for the site; submit `/sitemap.xml`. *(needs your Google login — steps in the hand-over message.)*
- [ ] **G-2 (U)** Confirm Cloudflare Web Analytics token is set in the deploy (`NEXT_PUBLIC_CF_BEACON_TOKEN`) and the dashboard shows visits.
- [ ] **G-3 (C)** Tiny `events` table (anonymous id, event, branch, source, ts) for: test_started, test_submitted, review_opened, ai_used, invite_shared, share_clicked. Privacy-minimal; no answers stored.
- [ ] **G-4 (C)** Admin-only weekly metrics query (WAL, activations by source, D1/D7) — a script, not a UI.
- [ ] **G-5 (U)** Create the tracking sheet (tabs in ASSETS §5).

## P1 — Channels live

- [ ] **T-1 (U)** Create the RENYXERA Telegram channel + discussion group; add bot + 2 GitHub secrets (follow `docs/TELEGRAM_SETUP_AND_PROMOTION.md`).
- [~] **T-2 (C)** GATE Daily week 1 (7 posts, answers verified from DB). *Drafted in ASSETS §2.*
- [ ] **T-3 (C)** Make the daily workflow post PYQs across live branches with UTM links + next-day answer.
- [ ] **C-1 (C+U)** Research 20 GATE communities (Telegram, Reddit, Discord, Quora Spaces): rules, size as shown, activity. C researches public pages; U joins with your own accounts.
- [ ] **C-2 (C+U)** Research 20 micro-creators (GATE YouTube/Instagram, 1k–100k) per ASSETS §5 columns.
- [ ] **C-3 (U)** Contribute value in the top 5 communities for a week before any link (log in sheet).
- [ ] **Q-1 (C drafts / U posts)** 5 Quora/Reddit answers to high-intent threads (skeleton ASSETS §3).

## P1 — Product-led loops

- [x] **L-1 (C)** "Challenge a friend" row on every public question page (WhatsApp / Telegram / copy link, `utm_medium=share&utm_campaign=share_q`). *8 Oct.*
- [ ] **L-2 (C)** Surface the invite link after a good result and in Profile ("Invite a friend preparing for GATE").
- [ ] **L-3 (C)** Proper Share result: public result page + preview image + copy link + share sheet; rename button back to "Share result". *(planned earlier)*
- [ ] **L-4 (C)** "Beat my score" — share a link to the same test set; friend sees the score to beat after finishing.
- [ ] **L-5 (C+U)** Telegram bot: phone verification + weekly report (planned earlier; needs bot token).

## P1 — SEO gaps

- [ ] **S-1 (C)** Branch syllabus-with-weightage pages: EC, EE, ME, DA (from tag data).
- [ ] **S-2 (C)** "Most repeated topics" article per branch (computed from tags; numbers shown with method).
- [ ] **S-3 (C)** Internal "practise more on this topic" CTA on every question page.
- [ ] **S-4 (C)** Titles/meta review once Search Console shows impressions (needs G-1).
- [ ] **S-5 (C)** Branch score/rank predictor + cut-offs — only after official per-branch data sources are verified.

## P2 — Content engine

- [ ] **V-1 (U)** Record 3 Shorts/Reels from GATE Daily (screen recording of the simulator, 30 s).
- [ ] **V-2 (C)** Weekly "Topic ROI" data post drafts (Reddit/LinkedIn), from S-2 data.
- [ ] **V-3 (C)** Countdown content calendar to 6 Feb 2027 (admit card 4 Jan, results 19 Mar).

## P2 — Partnerships & directories

- [ ] **P-1 (U)** First 3 personalised partner offers (templates ASSETS §4) after C-3.
- [ ] **P-2 (C+U)** List 10 legitimate free directories/edu lists reaching students; U submits.
- [ ] **P-3 (C)** College-club offer page (a club-specific challenge link).

## Later

- [ ] WhatsApp reports (after revenue) · [ ] CE launch content once CE is live · [ ] 2017–2020 papers for non-CS branches · [ ] ambassador programme (recognition only).

## Weekly ritual (Sunday, 20 min)
Metrics → channel leaderboard (time per activated user) → close/scale experiments → pick next 3 tasks.
