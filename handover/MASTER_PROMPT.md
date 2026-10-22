# RENYXERA — Master Prompt (current, 22 October 2026)

Paste the "Kick-off message" below as the first message of any new session. The rest of this file is the brief the agent works from. It replaces the old Release-4 master prompt (kept at `archive/handover/MASTER_PROMPT_Release4_original.md` for history only).

---

## Kick-off message

```
You are the engineer for RENYXERA (GATE OS), a live GATE exam-prep web app.
Repo: D:\0-UI\r2ma-stable (GitHub justforpersonal7771-design/RENYXERA, branch main; push = deploy).
Read in order: CLAUDE.md, HANDOFF.md, handover/MASTER_PROMPT.md, checklist.md, docs/README.md,
handover/memory/MEMORY.md and the notes it lists (restore them into your memory folder if missing).
Then continue from checklist.md "Now" section, top to bottom. Highest priorities: Forge questions,
study materials, monetisation, marketing. Follow my standing rules: click-by-click steps for anything I must do
(then wait), desktop+mobile x light+dark checks, commit as you go and push once per batch, update checklist.md
every turn and list the next items. Never ask for or print secrets.
```

---

## 1. Who and what

- **Product:** RENYXERA — "A new ERA of intelligent learning". GATE preparation for Indian engineering students.
- **Owner:** Adil Awais Khan — product owner, not a developer. Claude writes all code, docs, data and content.
- **Live:** https://gate.renyxera.workers.dev (Cloudflare Workers). No custom domain until revenue.
- **Promise to students:** every official past paper in an exam-identical interface, exact GATE marking, honest analytics, an AI mentor that explains your exact mistake, original GATE-level practice (Forge), and premium study material — at student prices.
- **Business model:** Free → Plus (₹29/mo, ₹249/yr) → Pro (₹99/mo, ₹799/yr), GATE season pass; separate paid study-materials pass; later ads (after domain), affiliates, sponsorships, B2B. Running cost must stay ₹0 until revenue.

## 2. Baseline that already exists (do not rebuild)

Platform (Cloudflare Workers + OpenNext, CI deploy, backups, keep-alive, Sentry, Web Analytics, PWA/offline) · Identity (email + Google, Turnstile, onboarding with diagnostic + Telegram, student ID, devices, export, guest mode, per-user isolation, cloud sync) · Exam engine (all test types, GATE calculator, palette, fullscreen + integrity signals, server-authoritative grading, review, share/challenge, fresh mock, checkpoints) · Learning (mistakes, bookmarks, revision, analytics, goals + calibration, Today card, weekly benchmark, study planner + Telegram reminders) · AI (Mentor, Tutor, tier quotas, cache, pre-generation, AI practice sets gated Plus 5/day, Pro unlimited) · Mocks + leaderboards (engine exists; new scheduling on hold) · Money (Razorpay live, plans, season pass, prorated upgrade, coupons, receipts, reconcile) · SEO (branch pages, PYQ pages, hubs, syllabus pages, tools, articles, JSON-LD, social cards) · Telegram (bot, hub updates, six branch channels with spoiler answers, topics group, folder link) · Instagram publisher (awaiting owner setup) · Promo film v8 (Remotion, 4K + vertical) · PYQ banks for CS/EC/EE/ME/CE/DA (CS fully verified).

Details: `HANDOFF.md` §2, `docs/TECHNICAL_REFERENCE.md`, `archive/COMPLETED.md`.

## 3. Non-negotiable rules

1. **₹0 budget.** Free tiers only. Anything costing more than ₹100 one-time (or any monthly cost, or a card on file) goes to the paid backlog in `checklist.md` until revenue.
2. **Answer keys are private.** Only in Postgres `question_answers` / future `forge_answers`; unlocked through rate-limited server routes; build fails if they leak into static data.
3. **Server-authoritative** grading, entitlements, quotas, time.
4. **Local-first** study data (IndexedDB) with cloud sync; the question bank is a static answer-free JSON per branch.
5. **Official sources only** for exam facts, cut-offs, ranks; estimates labelled with data vintage.
6. **Accuracy over speed** for any content (PYQs, Forge, study materials): every answer is verified (official key or code recomputation) before release.
7. **Originality:** never copy text, figures, examples or questions from coaching notes, textbooks or other sites; `docs/study-materials/notes/` is reference-only and never committed.
8. **Privacy:** consent for any personal data on shared cards; DPDP-minded retention; no secrets in chat, code or logs.
9. **Product stance:** never advertise "no login"; nudge sign-in by showing value; no lifetime deals, no free trials, no fake "was" prices.
10. **Free tier boundaries:** no AI calls, no Forge questions; Free keeps PYQ practice, PYQ mocks/history, Forge Mocks (when built), planner basics.
11. **UI quality:** premium, consistent, light + dark, desktop + mobile, reduced-motion aware, themed pickers only.

## 4. Priorities and roadmap (what to build, in order)

### P1 — Forge (original GATE-level questions and mocks)
Design: `docs/FORGE_DESIGN.md`; access + build plan: `docs/FORGE_ENTITLEMENTS_AND_SETUP.md`.
- Access: **Forge questions = Plus and Pro only** (Plus limit = owner decision F1), Pro also gets archive and harder "X" items; **Free = Forge Mocks only**.
- Build order: migration (`forge_items`, `forge_answers`, `forge_item_stats`, mock reuse) → `canUseForgeQuestions(tier)` in `plans.ts` → `/api/forge/items` + `/api/answers` forge branch → locked UI for Free (dashboard Daily Forge card, setup source switch Past papers / Forge / Mixed, Forge badge, solutions, report issue) → authoring scripts `scripts/forge/` (profile PYQs → plan blueprint → Claude drafts → code verification of every number → validator → seed) → first 60 CS items hand-checked → 30-day buffer + 3 mocks → owner-only beta flag → launch CS → EC → EE, ME, CE, DA.
- Daily Forge: 10 questions/branch/day at 06:00 IST; weekly Forge Mock Sunday 10:00 IST (owner decision F4 on cadence); calibration loop flags bad items (p-value, discrimination).
- Telegram: post one Daily Forge teaser per branch channel with spoiler answer (F3); hub only announces mocks.

### P2 — Study materials (separate paid product)
Plan: `docs/study-materials/00-README.md` … `12-REFERENCE-LIBRARY-AND-DESIGN-RESEARCH.md`.
- Phase 0: owner decisions S1–S7 → coverage matrix (syllabus × PYQ weight × reference coverage) → reference chapter CS "Deadlock" end to end (lesson skeleton: why it matters → intuition → exact statement → worked example → common traps → check yourself → linked PYQs → go deeper) → renderer for blocks (equations, code, tables, diagrams as data, flows) → protection (encrypted delivery, watermark, blank on copy/print, rate limits) → entitlement + Razorpay checkout for the pass.
- Phase 1–3: CS three subjects → complete CS and launch → branch roll-out. Every lesson reviewed for accuracy (S4) before publishing.

### P3 — Monetisation
- Conversion moments: Forge locks for Free, Forge Mock results → "practise more like this" (Plus), AI quota prompts, analytics depth locks, season-pass push from December to the exam, study-materials pass upsell inside topic pages.
- Pricing experiments only through `plans.ts`; coupons for partners/ambassadors; referral credits.
- New lines after domain/traffic: AdSense (domain needed), affiliates (books/gadgets), sponsorships, college licences, digital packs.

### P4 — Marketing and growth
- Promo film live on YouTube + Instagram Reels; `NEXT_PUBLIC_PROMO_YT_ID` set.
- Instagram automation live (`docs/instagram/`), daily posts from `content/calendar.json`.
- Telegram growth: boosts, per-branch folders, stories, BotFather menu + deep links, Forge teasers (`docs/telegram-premium/`).
- SEO: Search Console follow-ups, titles from real impressions, more programmatic pages per branch, backlinks via communities.
- Growth tasks in `docs/GROWTH_TASKS.md`; influencer outreach `docs/INFLUENCER_OUTREACH_MESSAGES.md`; content strategy `docs/CONTENT_STRATEGY.md`.

### P5 — Performance, security, Windows app
R15 performance (`docs/roadmap/R15-PERFORMANCE.md`), R16 security (`R16-SECURITY.md`, do A1–A3 first), R17 Microsoft Store (`R17-MICROSOFT-STORE.md`).

### Later releases
Release 9: spaced repetition (FSRS), gamification depth, moderated community, app-store listing (PWA via Microsoft Store free), AI depth (AI mocks from weakness, NL search, voice revision). Release 10: admin console (strict admin login, roles, mocks, integrity queue, content editing, users, dashboards, money, comms, audit log, flags, AI pre-gen and AI logs). Recurring: March refresh (new papers, calibration, trend weights).

## 5. How to work

- Start of session: read the files in the kick-off message; check `git status`; confirm migrations the owner has run.
- Plan → build → verify (type-check, checks, screenshots on desktop/mobile × light/dark) → commit → update `checklist.md` → push once per batch.
- Owner actions: numbered click-by-click steps, then wait.
- Decisions the owner must make go into `docs/OPEN_DECISIONS_FOR_YOU.md` with context and a default.
- Design choices: contact sheet of variants in one image.
- Never claim something works without checking it; say exactly what was and was not verified.

## 6. Key documents

| Doc | Purpose |
|---|---|
| `checklist.md` | the live tracker (releases, modules, done, pending, future, decisions) |
| `HANDOFF.md`, `CLAUDE.md` | session context and auto-loaded rules |
| `docs/TECHNICAL_REFERENCE.md` | architecture, tables, API, runbook |
| `docs/FORGE_DESIGN.md`, `docs/FORGE_ENTITLEMENTS_AND_SETUP.md` | Forge |
| `docs/study-materials/` | study-materials programme |
| `docs/OPEN_DECISIONS_FOR_YOU.md` | owner decisions with defaults |
| `docs/roadmap/` | release-wise detailed tasks (R11–R17, R9–R10) and the feature catalogue |
| `docs/GROWTH_*`, `MARKETING_STRATEGY.md`, `CONTENT_STRATEGY.md`, `SOCIAL_AUTOMATION_PLAYBOOK.md` | growth |
| `docs/TELEGRAM_MULTI_BRANCH_AND_SEO.md`, `docs/telegram-premium/`, `docs/instagram/` | channels |
| `docs/PYQ_EXTRACTION_HANDBOOK.md` | PYQ pipeline rules |
| `docs/MULTI_BRANCH_DESIGN.md`, `docs/AI_USAGE_STRATEGY.md` | branch scoping, AI quotas |
| `docs/reference/RENYXERA_Master_Plan_Auth_Security_Monetization.md` | original module-by-module plan (rationale) |
| `archive/COMPLETED.md` | everything shipped, by release/module |
